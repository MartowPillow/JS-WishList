const handlebars = require('handlebars')
const { join } = require('path')
const { readFileSync } = require('fs')
const { log } = require('console')

handlebars.registerHelper('stringify', function (v) {
    return JSON.stringify(v)
})

const uuids = [
    "ad1afbd2-77d2-404e-bbca-3f352f7f09a2",
    "c067b934-d98f-4d0a-a4a3-c89c05a00e4a",
    "b2d3ff2a-9d6a-4347-9bf9-98bb7f196c2d", 
    "a0220d6b-2431-474c-bf07-1940932442b8",
    "301b133b-3ea2-4ef0-926d-3abaf903b4f2"
]

function packageJson() {
    return JSON.stringify({
        "name": "dredd-testing",
        "dependencies": {
            "chai": "4.2.0",
            "chai-http": '4.3.0',
            "mocha": '8.2.1',
            "chai-arrays": '2.2.0',
            "chai-things": '0.2.0',
            "witch": '1.0.3',
            "chai-subset": '1.6.0',
            "chai-uuid": '1.0.6'
        },
        "scripts": {
            "test": "mocha --exit"
        }
    })
}

function generateObject(properties, value) {
    return Object.getOwnPropertyNames(properties).reduce((result, propertyName) => {
        result[propertyName] = getPropertyValue(properties, propertyName)
        return result
    }, {})
}

function getPropertyValue(properties, propertyName) {
    const q = properties[propertyName]
    if (q.type == "enum") {
        return q.enum[0]
    }
    if (q.type == "integer") {
        return 42
    }
    if (q.type == "float") {
        return 42.42
    }
    return "Yolo"
}

function generateCode(config, defaultPayload) {
    const t = Object.getOwnPropertyNames(config.properties).map((propertyName) => {
        const results = {
            property: propertyName,
            posibilities: []
        }

        const l = {...defaultPayload }
        delete l[propertyName]

        let a = {
            name: `${propertyName} is not defined`,
            payload: l
        }
        results.posibilities.push(a)

        a = {
            name: `${propertyName} is null`,
            payload: {...defaultPayload}
        }
        a.payload[propertyName] = null
        results.posibilities.push(a)

        const property = config.properties[propertyName]
        if (property.type == 'string' || property.type == 'enum') {
            a = {
                name: `${propertyName} is empty`,
                payload: {...defaultPayload}
            }
            a.payload[propertyName] = ""
            results.posibilities.push(a)
        }
        if (property.type == 'enum') {
            a = {
                name: `${propertyName} is an invalid enum`,
                payload: {...defaultPayload}
            }
            a.payload[propertyName] = "WRONG_ENUM"
            results.posibilities.push(a)
        }

        if (property.type == 'integer' || property.type == 'float') {
            a = {
                name: `${propertyName} is a string `,
                payload: {...defaultPayload}
            }
            a.payload[propertyName] = "STRING"
            results.posibilities.push(a)
        }
        return results
    })

    properties = Object.getOwnPropertyNames(config.properties)

    return t.map((property) => {
        return property.posibilities.map((p) => {
            const y = properties.filter(x => ![property.property].includes(x));
            const add = y.reduce((v, p) => {
                const q = config.properties[p]
                if (q.type == "string") {
                    v[p] = "Yolo"
                }
                if (q.type == "enum") {
                    v[p] = q.enum[0]
                }
                if (q.type == "integer") {
                    v[p] = 42
                }
                if (q.type == "float") {
                    v[p] = 42.42
                }
                return v
            }, {})
            return {
                ...p,
                payload: {
                    ...p.payload,
                    ...add
                }
            }
        })
    }).reduce((p, i) => {
        return p.concat(i)
    }, [])
}

function testCodeGenerator(config) {
    const content = readFileSync(join(__dirname, 'templates', 'chai.js.tpl'))
    const compiled = handlebars.compile(content.toString())
    const a = {}

    e = generateCode(config, {})

    const examplesClean = [ ...config.examples ]

    const {uuid, user, ...rest} = examplesClean[0]

    f = generateCode(config, rest)

    const userone = [examplesClean[0], examplesClean[1]].map((v, i) => {
        const el = {...v}
        delete el.user
        el["uuid"] = uuids[i]
        return el
    })

    const item1 = { ...examplesClean[0] }
    delete item1.user
    item1["uuid"] = uuids[0]

    const createBody = generateObject(config.properties)
    return compiled({
        config, 
        post: e, 
        put: f, 
        userone: userone,
        item1,
        createBody
    })
}


module.exports = (config) => {
    return [
        {
            path: 'package.json',
            content: packageJson()
        },
        {
            path: 'test.js',
            content: testCodeGenerator(config)
        }
    ]
}