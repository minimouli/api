mongosh -- "$MONGO_INITDB_DATABASE" <<EOF
    let rootUser = '$MONGO_INITDB_ROOT_USERNAME'
    let rootPass = '$MONGO_INITDB_ROOT_PASSWORD'
    let admin = db.getSiblingDB('admin')
    admin.auth(rootUser, rootPass)
    let user = '$MONGO_INITDB_USERNAME'
    let pwd = '$MONGO_INITDB_PASSWORD'
    db.createUser({
        user,
        pwd,
        roles: ['readWrite']
    })
EOF
