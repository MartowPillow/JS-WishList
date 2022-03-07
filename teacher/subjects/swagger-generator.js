const YAML = require('yaml')

function getOpenApiType(property, propertyName, example) {
    if (property.type == "integer") {
        return {
            type: "integer",
            example: example[propertyName]
        }
    } else if (property.type == "enum") {
        return {
            type: "string",
            enum: property.enum.map(element => {
                return element
            }),
            example: example[propertyName]
        }
    } else if (property.type == "float") {
        return {
            type: "number",
            format: "float",
            example: example[propertyName]
        }
    }

    return {
        type: "string",
        example: example[propertyName]
    }
}

function Openapi(subject, properties) {

    const specApi = {
        get: {
            security: [
               {
                   bearerAuth: []
               }
            ],
            parameters: [
                {
                    in: "path",
                    name: "uuid",
                    schema: {
                      type: "string",
                      format: "uuid",
                      example: "ad1afbd2-77d2-404e-bbca-3f352f7f09a2"
                    },
                    required: true,
                    description: `The ${subject} id`
                }
            ],
            responses:{
                200: {
                    description: `${subject} founded`,
                    content: {
                        "application/json": {
                            schema: {
                                "$ref": `#/components/schemas/${subject}_read`
                            }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized'
                },
                404: {
                    description: `${subject} not found`,
                }
            }
        },
        put: {
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    in: "path",
                    name: "uuid",
                    schema: {
                      type: "string",
                      format: "uuid",
                      example: "ad1afbd2-77d2-404e-bbca-3f352f7f09a2"
                    },
                    required: true,
                    description: `The ${subject} id`
                }
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            "$ref": `#/components/schemas/${subject}_cu`
                        }
                    }
                }
            },
            responses:{
                200: {
                    description: `${subject} modified`,
                    content: {
                        "application/json": {
                            schema: {
                                "$ref": `#/components/schemas/${subject}_read`
                            }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized'
                },
                404: {
                    description: `${subject} not found`,
                },
                422: {
                    description: `${subject} payload is invalid`
                }
            }
        },
        delete: {
            security: [
                {
                    bearerAuth: []
                }
            ],
            parameters: [
                {
                    in: "path",
                    name: "uuid",
                    schema: {
                      type: "string",
                      format: "uuid",
                      example: "ad1afbd2-77d2-404e-bbca-3f352f7f09a2"
                    },
                    required: true,
                    description: `The ${subject} id`
                }
            ],
            responses:{
                204: {
                    description: `${subject} deleted`,
                },
                401: {
                    description: 'Unauthorized'
                },
                404: {
                    description: `${subject} not found`,
                }
            }
        }
    }

    spec = {
        openapi: "3.0.0",
        info: {
            title: "Javascript Project",
            description: "Api for Javascript Project",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:10200/api",
                description: "The api in the docker compose",
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
            schemas: {}
        },
        paths: {
            "/login": {
                post: {
                    tags: [
                        "auth"
                    ],
                    responses: {
                        200: {
                            description: "Login success"
                        }
                    }
                }
            },
        },
    }

    spec.paths[`/${subject}`] = {
        get: {
            security: [
                {
                    bearerAuth: []
                }
            ],
            responses: {
                200: {
                    description:`"List all ${subject}`,
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    "$ref": `#/components/schemas/${subject}_read`
                                }
                            }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized'
                },
            }
        },
        post: {
            security: [
                {
                    bearerAuth: []
                }
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            "$ref": `#/components/schemas/${subject}_cu`
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: `${subject} created`,
                    content: {
                        "application/json": {
                            schema: {
                                "$ref": `#/components/schemas/${subject}_read`
                            }
                        }
                    }
                },
                401: {
                    description: 'Unauthorized'
                },
                422: {
                    description: `${subject} payload is invalid`
                }
            }
        },
    };

    const baseSchema = {}

    baseSchema[`${subject}_read`] = {
        type: "object",
        required: [
            "uuid"
        ],
        properties: {
            uuid: {
                type: "string",
                format: "uuid"
            }
        }
    }

    baseSchema[`${subject}_cu`] = {
        type: "object",
        required: [
        ],
        properties: {
            
        }
    }

    const schemas = Object.getOwnPropertyNames(properties.properties).reduce(
        (p, c) => {
            p[`${subject}_cu`].required.push(c)
            p[`${subject}_cu`].properties[`${c}`] = getOpenApiType(properties.properties[c], c, properties['examples'][0])
            p[`${subject}_read`].required.push(c)
            p[`${subject}_read`].properties[`${c}`] = getOpenApiType(properties.properties[c], c, properties['examples'][0])
            return p
        }, 
        baseSchema
    )

    spec.components.schemas = schemas

    spec.paths[`/${subject}/{uuid}`] = specApi

    return YAML.stringify(spec)
}

module.exports = (config, subjectName) => {
    return [
        {
            path: 'swagger.yml',
            content: Openapi(subjectName, config)
        }
    ]
}