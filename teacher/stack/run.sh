#!/usr/bin/env bash

ENV=$1

ACTION=$2

if [ -z $ENV ]; then 
    echo "./run/sh (local, prod)"
    exit 1
else 
    if [ $ENV != "local" ] && [ $ENV != "prod" ]; then 
        echo "env $ENV doesn't exist"
        exit 1
    fi
fi

if [ -z $ACTION ]; then
    echo "./run/sh $ENV (create|provision|destroy)"
    exit 1
fi

# source .env.$ENV
source .env.local

if [ $ENV == "local" ]; then 

    cd infra/local
    if [ $ACTION == "create" ]; then
        vagrant up
    elif [ $ACTION == "provision" ]; then 
        PLAYBOOK=$3
        if [ -n $PLAYBOOK ]; then
            OPTIONS="--provision-with $PLAYBOOK"
        fi
        vagrant provision $OPTIONS
    elif [ $ACTION == "destroy" ]; then
        vagrant destroy -f
    elif [ $ACTION == "ssh" ]; then 
        VM=$3
        vagrant ssh $VM
    else
        echo "action $ACTION is not defined"
        exit 1
    fi
elif [ $ENV == "prod" ]; then
    if [ $ACTION == "create" ]; then
        terraform init -upgrade infra/prod
        terraform apply infra/prod
    elif [ $ACTION == "provision" ]; then 
        PLAY=$3
        if [ -z $PLAY ] || [ $PLAY == "primary" ]; then
            .venv/bin/ansible-playbook -i infra/prod/inventory -e @infra/prod/vars.yml ansible/primary.playbook.yml
        fi
        if [ -z $PLAY ] || [ $PLAY == "runner" ]; then
            .venv/bin/ansible-playbook -i infra/prod/inventory -e @infra/prod/vars.yml -vv ansible/drone-runner.playbook.yml
        fi
    elif [ $ACTION == "destroy" ]; then
        terraform destroy infra/prod
    elif [ $ACTION == "ssh" ]; then 
        VM=$3
        if [ -z "$VM" ]; then
            echo "./run/sh $ENV $ACTION VM_NAME"
            exit 1
        fi
        echo"ssh debian@$VM"
    else
        echo "action $ACTION is not defined"
        exit 1
    fi
fi