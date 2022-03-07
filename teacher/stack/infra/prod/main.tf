variable "ovh_user_name" {}

variable "ovh_password" {}

variable "ovh_api_key" {}

variable "ovh_api_secret" {}

variable "ovh_api_consumer_key" {}

locals {
  count_runner = 0
}

terraform {
  required_providers {
    openstack = {
      source = "terraform-provider-openstack/openstack"
      version = "1.33.0"
    }
    ovh = {
      source = "ovh/ovh"
      version = "0.10.0"
    }
    local = {
      source = "registry.terraform.io/hashicorp/local"
      version = "2.0.0"
    }
    template = {
      source = "hashicorp/template"
      version = "2.2.0"
    }
    github = {
      source = "integrations/github"
      version = "4.2.0"
    }
  }
}

provider "ovh" {
  endpoint = "ovh-eu"
  application_key = var.ovh_api_key
  application_secret = var.ovh_api_secret
  consumer_key = var.ovh_api_consumer_key
}

provider "github" {

}

provider "openstack" {
  auth_url = "https://auth.cloud.ovh.net/v3"
  domain_name = "Default"
  user_name = var.ovh_user_name
  password = var.ovh_password
  tenant_id = "612ce41aa31b4be0a60abe70f2903122"
  region = "GRA3"
}

data "openstack_images_image_v2" "debian" {
  name        = "Debian 10"
  most_recent = true
}

resource "openstack_compute_keypair_v2" "test-keypair" {
  name       = "me"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDXAdHrf3WY5bidt1ERb3/jS8qupj9QQ3m2Jr8xIgS+lRhCvjx9nevWH8rucccSZ4ztj4d3bocJbjxSMvu4lahKz9QaTl0J+6AYBIIvB/H3QmiL3BbYQ7VG6b4MJPuEYOnp835Ii7m1CFqc0Mn6FNlhg3QsoxBZiu+dhVDBMt3XZIBMnQuCeY0tGzl+Al/P5XCGv6nfJQIl/50Ln+OqFtncEPX8FfFvPt5VGkHRjgHc91Rl46BX/ntqOQpR8mf8oUlb0fXpkwgN8yrCL7e0icP/w/QRIFtDLNsi5o+IkSs3EpE5WRsEEkUyhUb9MMmNndPhRR+/g0vOolH4KlXqXN3BKGVSFUDGXHnD0YAcNCxti8Q/m3j4BihwxJw/mQjSFaEMfn6SzMAspkjgh5GE5aAy+9wV5q9tRGks4ns1rjoqSSVGTTyTU0At4hEryTVKABYMvaKOQjKCb0kVwX0L/3hu6zCAtnoitKP5O6GnaAhfVx9nClWHKtoPZudr2p1vJWW39FQ6bOAOJQOScM1nxxUKN7fr39xpyr0a0vWYzrgrVBL8g/hekn3HqTtwdt7ZkrC+uoCxfEUmsqIZ8M4/dQtwB34RjBpV2m2GPK2dya2SEhHsExrAsaGkLstKAfEHBlx/HNUkVlX0l+7COlW1mRHq228yDOv1kRQyrvtc1okhYQ=="
}

resource "openstack_compute_instance_v2" "primary" {
    name = "primary"
    image_id = data.openstack_images_image_v2.debian.id
    flavor_name = "s1-2"
    key_pair = "me"
    region = "GRA3"
}

resource "openstack_compute_instance_v2" "runner" {
    count = local.count_runner
    name = "runner${count.index}"
    image_id = data.openstack_images_image_v2.debian.id
    flavor_name = "s1-2"
    key_pair = "me"
    region = "GRA3"
}

resource "ovh_domain_zone_record" "a_drone" {
    zone = "dioudonnat.fr"
    subdomain = "drone.edu"
    fieldtype = "A"
    ttl = "300"
    target = openstack_compute_instance_v2.primary.network[0].fixed_ip_v4
}

resource "ovh_domain_zone_record" "a_portainer" {
    zone = "dioudonnat.fr"
    subdomain = "portainer.edu"
    fieldtype = "A"
    ttl = "300"
    target = openstack_compute_instance_v2.primary.network[0].fixed_ip_v4
}

resource "ovh_domain_zone_record" "a_runne" {
    count = local.count_runner
    zone = "dioudonnat.fr"
    subdomain = "runner${count.index}.server.edu"
    fieldtype = "A"
    ttl = "300"
    target = openstack_compute_instance_v2.runner[count.index].network[0].fixed_ip_v4
}

# data "template_file" "vars" {
#   template = file("${path.cwd}/${path.module}/vars.tpl")
#   # vars = {
#   #   consul_address = "${aws_instance.consul.private_ip}"
#   # }
# }

# # resource "local_file" "foo" {
# #     content     = data.template_file.vars.rendered
# #     filename = "${path.cwd}/${path.module}/vars.yml"
# # }

data "template_file" "inventory" {
  template = file("${path.cwd}/${path.module}/inventory.tpl")
  vars = {
    primary_ip = openstack_compute_instance_v2.primary.network[0].fixed_ip_v4
    runner_ips = join("\n", openstack_compute_instance_v2.runner[*].network[0].fixed_ip_v4)
  }
}

resource "local_file" "inventory" {
    content     = data.template_file.inventory.rendered
    filename = "${path.cwd}/${path.module}/inventory"
}
