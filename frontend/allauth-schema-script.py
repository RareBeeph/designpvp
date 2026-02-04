import yaml

excludeList = ["_allauth", "{client}", "v1"]

with open("allauth-schema.yaml") as stream:
    schema = yaml.safe_load(stream)

for path in schema["paths"].keys():
    for operation in schema["paths"][path].keys():
        operationId = operation + "".join(
            [p.capitalize() for p in path.split("/") if p not in excludeList]
        )
        schema["paths"][path][operation]["operationId"] = operationId

with open("allauth-schema.yaml", "w") as outfile:
    yaml.safe_dump(schema, outfile, sort_keys=False)
