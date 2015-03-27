# weebly_private


# to start memcached
# launchctl load -w ~/Library/LaunchAgents/homebrew.mxcl.memcached.plist

# start mongo
# mongod

# start multiple mongo instances
# sudo mongod --configsvr --dbpath /data/db --port 27019

# sudo mongod --configsvr --dbpath /data/db2 --port 27020

# sudo mongod --configsvr --dbpath /data/db3 --port 27021

# mongos --configdb 127.0.0.1:27019,127.0.0.1:27020,127.0.0.1:27021

# mongo --host 127.0.0.1 --port 27017

sh.addShard( "rs1/127.0.0.1:27017" )

sh.addShard( "127.0.0.1:27017" )

# sh.shardCollection("weebly.users", {"id": "hashed"})
# sh.shardCollection("weebly.pages", {"ownerId": "hashed"})
# sh.shardCollection("weebly.elements", {"ownerId": "hashed"})
# sh.shardCollection("weebly.positions", {"ownerId": "hashed"})
# sh.shardCollection("weebly.contents", {"ownerId": "hashed"})


# procedure for interacting with db
# get a specific page
# get /api/page/:id
# for each element in elementIds
# get /api/element/:id
# for each element get 
##### content
##### position


