MONGODB_URI=$(node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)")

mongosh --eval "use hackai" --eval  "db.dropDatabase()"
mongodump --uri="$MONGODB_URI"
mongorestore --db hackai dump/hackai
