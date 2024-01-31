const mongoClient = require('mongodb').MongoClient


const getCp08Db={
    db:null
}

const getAttendanceDb={
    db:null
}


module.exports.connect=(done)=>{
    
    mongoClient.connect('mongodb://localhost:27017',{useNewUrlParser:true},(err,data)=>{
        if(err) return done(err)
        getCp08Db.db=data.db('NTTF')
        getAttendanceDb.db=data.db('Attendance')
        done()
    })
}

module.exports.getCp08Db=function(){
    return getCp08Db.db
}

module.exports.getAttendanceDb=function(){
    return getAttendanceDb.db
}

