const mongoClient = require('mongodb').MongoClient


const state={
    db:null
}

module.exports.connect=(done)=>{
    
    mongoClient.connect('mongodb://localhost:27017',{useNewUrlParser:true},(err,data)=>{
        if(err) return done(err)
        state.db=data.db('CP08')
        done()

    })
}

module.exports.get=function(){
    return state.db
}

