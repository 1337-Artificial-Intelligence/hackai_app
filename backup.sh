mongosh --eval "use hackai" --eval  "db.dropDatabase()"
mongodump --uri="mongodb+srv://hackai:B2ndDigaAMY98kRb@cluster0.sw6xchf.mongodb.net/hackai"
mongorestore --db hackai dump/hackai