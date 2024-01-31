var db=require('../config/connection')
var objectId=require('mongodb').ObjectId
const bcrypt = require('bcrypt')
var XLSX       = require('xlsx');
var mongoose = require('mongoose')

module.exports={
    getAttendance:()=>{
        return new Promise(async (resolve,reject)=>{
            let attendance=await db.getAttendanceDb().collection("cp081").find().toArray()
            resolve(attendance)
        })
    },
    // addAttendance:(trainee)=>{
        
    //     return new Promise((resolve,reject)=>{
            
          
            
    //         db.getAttendanceDb().collection("cp08").insertOne(trainee)
    //         resolve()
    //     })
    // },
    addAttendance:(trainees,course,year)=>{
        
        return new Promise(async(resolve,reject)=>{
            
            var cname=course+year

            let attendance=await db.getAttendanceDb().collection(cname).findOne()
            if(attendance)
            {
                for(let i=0;i<Object.keys(trainees).length;i++)
                {
                    var current=Object.keys(trainees)[i];

                    var status={
                        date:dateOnly(new Date()),
                        status:Object.values(trainees)[i]
                    }

                    db.getAttendanceDb().collection(cname)
                    .updateOne({tokennumber:current},
                        {
                            
                                $push:{status:status}
                            
                        }).then(()=>{
                            resolve()
                        })
                    
                }
                
            }
            else
            {
                console.log(trainees);
                for(let i=0;i<Object.keys(trainees).length;i++)
                {
                    
                    var current=Object.keys(trainees)[i];
                    student={
                        
                        tokennumber:current,
                        status:[
                            {
                                date:dateOnly(new Date()),
                                status:Object.values(trainees)[i]
                            }
                        ]
                    }
                    await db.getAttendanceDb().collection(cname).insertOne(student).then(()=>{
                        resolve()
                    })
                    
                }
                
            }
            
                
                
            
            
            
        })
    }
}



function dateOnly(date){

    var day=date.getDate()   
    var month=date.getMonth()+1 
    var year=date.getFullYear()
  
    return day+'/'+month+'/'+year
  }