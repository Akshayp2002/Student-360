var express = require('express');
var router = express.Router();
var nttfHelper= require('../helper/nttfhelper')
var attendanceHelper= require('../helper/attendancehelper')
let user







var XLSX       = require('xlsx');
var multer     = require('multer');
const attendancehelper = require('../helper/attendancehelper');
//multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage });



router.get('/',(req,res)=>{
  
  user=req.session.user
  if(user.admin)
  {
    res.render('../views/admin/dashboard',{user})
  }
  else if(user.staff)
  {
    res.render('../views/staff/dashboard',{user})

  }
  else if(user.student)
  {
    res.render('../views/student/dashboard',{user})
    
  }
  else
  {
    res.render('../views/partials/login')
  }
  
  
})


router.post('/login',(req,res)=>{
  nttfHelper.doLogin(req.body).then((response)=>{
    if(response.status)
    {
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/dashboard')
    }
    else
    {
      req.session.loginErr='incorrect email or password!'
      res.redirect('/login')
    }
  })
})



router.get('/logout',(req,res)=>{
  req.session.destroy()
  
  res.redirect('/')
})




router.get('/dashboard',(req,res)=>{
  user=req.session.user
  if(user.admin)
  {
    res.render('../views/admin/dashboard',{user})
  }
  else if(user.staff)
  {
    res.render('../views/staff/dashboard',{user})
  }
  else if(user.student)
  {
    res.render('../views/student/dashboard',{user})

  }
})
  
router.get('/dashboard/viewtrainees',(req,res)=>{
 nttfHelper.getAllTrainee().then((trainees)=>{
   res.render('../views/admin/view_trainees',{user,trainees})
 })
})


router.get('/dashboard/viewstaff',(req,res)=>{
  nttfHelper.getAllStaff().then((staff)=>{
    res.render('../views/admin/view_teachers',{user,staff})
  })
 })

router.get('/dashboard/viewtrainee/profile/:id',async(req,res)=>{
  let traineeId=req.params.id
  let trainee=await nttfHelper.viewTrainee(traineeId)
  res.render('../views/admin/profile',{trainee,user})


})


router.get('/dashboard/viewtrainees/profile/edittraineeinfo/:id',async(req,res)=>{
    let traineeId=req.params.id
    let trainee=await nttfHelper.viewTrainee(traineeId)
      res.render('../views/admin/edittraineeinfo',{user,trainee})
})

router.post('/dashboard/viewtrainees/profile/edit_traineeinfo/:id',(req,res)=>{

  let traineeId=req.params.id
  nttfHelper.editTrainee(traineeId,req.body)



  res.redirect('/dashboard/viewtrainees/profile/'+req.params.id)


  })



router.post('/dashboard/viewtrainees/profile/:id',(req,res)=>{
  let traineeId=req.params.id
  res.redirect('/dashboard/viewtrainees/profile/'+traineeId)
})

router.get('/dashboard/courselist',(req,res)=>{
  res.render('./admin/course_list',{user})
})

router.get('/dashboard/attendance',(req,res)=>{

  attendanceHelper.getAttendance().then(async(attendance)=>{
    
    res.render('./admin/attendance_view',{user,attendance})
    
  })
})

router.get('/dashboard/nocn',(req,res)=>{
  res.render('./admin/nocn',{user})
})

router.get('/dashboard/courselist/viewtrainees',(req,res)=>{
  course=req.query.course
  year=parseInt(req.query.year)
  nttfHelper.getTraineeByCourseId(course,year).then((trainees)=>{
    res.render('./admin/view_trainees',{trainees,user})
  })
})

router.get('/dashboard/attendance/trainees',(req,res)=>{
  course=req.query.course
  year=parseInt(req.query.year)
  nttfHelper.getTraineeByCourseId(course,year).then((trainees)=>{
    res.render('./admin/attendance_entry',{trainees,user})
  })
})

router.post('/dashboard/attendance/trainees',(req,res)=>{
  
  
  var course=req.body.course
  var year=req.body.year

  console.log(course+year);


  var students=convertToBoolean(req.body)

  console.log(students);
  
  attendanceHelper.addAttendance(students,course,year).then(()=>{
    res.redirect('/attendancetable')
  })

})

router.get('/dashboard/mentoring',(req,res)=>{
  nttfHelper.getAllTrainee().then((trainees)=>{
    res.render('./admin/mentoring_table',{user,trainees})

  })
})

router.get('/dashboard/mentoring/student/:id',(req,res)=>{

  nttfHelper.viewTrainee(req.params.id).then((trainee)=>{
  res.render('../views/admin/mentoring_profile',{user,trainee})

  })

})

router.get('/dashboard/viewstaff/viewstaffprofile/:id',(req,res)=>{

  nttfHelper.getStaff(req.params.id).then((staff)=>{
    res.render('admin/privilege',{user,staff})
  })
})

router.post('/dashboard/viewstaff/viewstaffprofile',(req,res)=>{
  console.log(req.body);
  nttfHelper.editRole(req.body).then(()=>{
    res.redirect('/dashboard/viewstaff')
  })
  
})

router.get('/addtrainee',(req,res)=>{
  res.render('../views/admin/addtrainee',{user})
})


router.post('/addtrainee',(req,res)=>{
  nttfHelper.addTrainee(req.body).then((id)=>{
    res.redirect('/addtrainee')
  })
  
})

router.get('/addstaff',(req,res)=>{
  res.render('../views/admin/addstaff',{user})
})

router.post('/addstaff',(req,res)=>{
  nttfHelper.addStaff(req.body).then((id)=>{
    res.render('../views/admin/addstaff',{user})
  })
})

router.get('/addbulktrainees',(req,res)=>{
    res.render('../views/admin/addbulktrainees',{user})
})

  router.post('/addbulktrainees',upload.single('excel'),(req,res)=>{
    var trainees =  XLSX.readFile(req.file.path,{cellDates:true});
    nttfHelper.addBulkTrainees(trainees).then((err)=>{
      
      
    })
  })

  router.get('/create-staff',(req,res)=>{
    res.render('../views/admin/create_staff',{user})
  })
 
  router.post('/create-staff',(req,res)=>{
    nttfHelper.addStaff(req.body).then(()=>{
      res.redirect('/create-staff')
    })
  })
  router.get('/create-admin',(req,res)=>{
    res.render('../views/admin/create_admin',{user})
  })

  router.post('/create-admin',(req,res)=>{
    nttfHelper.addAdmin(req.body).then((id)=>{
      res.redirect('/create_admin')
    })
    })


  router.get('/profile',(req,res)=>{
    res.render('../views/admin/admin_profile',{user})
  })

  router.get('/setting',(req,res)=>{
    res.render('../views/admin/password_change',{user})
  })


  router.get('/notification',(req,res)=>{
    res.render('../views/admin/notification',{user})
  })



  


  router.get('/attendancetable',(req,res)=>{
    attendanceHelper.getAttendance().then((attendance)=>{
      res.render('./admin/attendance',{user,attendance})
    })
    
  })



  router.get('/reports',(req,res)=>{
    user=req.session.user
    res.render('../views/admin/reports',{user})
  })





  


  

module.exports = router;





function convertToBoolean(obj){
  
  // const today = new Date()
  // var monthName=today.toLocaleString('default', { month: 'long' })
  // var year=today.getFullYear()
  

  var students={}

  
  
  for(var i=2;i<Object.keys(obj).length;i++){
     if (Object.values(obj)[i]=='true')
     {
       var truevalue=Object.keys(obj)[i]
        students[truevalue]=true
     }
     else
     {
       var falsevalue=Object.keys(obj)[i]
       students[falsevalue]=false
     }
  }

  // var attendance={
  //   month:monthName,
  //   year:year,
  //   date:new Date(),
  //   students
  // }

  return students
}


