var express = require('express');
var router = express.Router();

const guestModel = require('../schemas/createGuest');

const multer = require('multer');

const guestBoard = require('../schemas/guestBoard');



//guest게시판 글 가져오기
router.get('/getList',function(req, res,next){
    guestBoard.find({},function(err,guestBoardContent){
        if(err) {
          return res.json(err);
        };
        //json형식으로 응답
        return res.json(guestBoardContent);
        })
  });        

  //금지된 host정보 가져오기
 router.get('/getBan', function(req, res, next){
    guestBoard.find({report : true}, function(err, getInfo){
        if(err){
            return res.json(err);
        };
        return res.json(getInfo);
    });
}) 


//guest게시판 작성자 정보 가져오기
router.get('/getMsg/:id', function(req, res, next){
    guestModel.find({userName : req.params.id}, function(err, guestIdInfo){
        if(err){
            return res.json(err);
        };
        return res.json(guestIdInfo);
    });
})



var newFile = "";

var storage = multer.diskStorage({
    //cb는 콜백 
    destination : function(req, file, cb){
        cb(null, 'public/images/guestBoard')
    },
    filename: function(req, file, cb){
        let checkFile = file.originalname;
        // var newFile = "";
        console.log("jpeg 있는곳의 index : " + checkFile.indexOf(".jpeg"));
        console.log("jpg 있는곳의 index : " + checkFile.indexOf(".jpg"))
        newFile = Date.now() + "" + checkFile;
        console.log("저장하는곳에서 변경된 파일명 : " + newFile);
        cb(null, newFile);
    }
})


var upload = multer({storage : storage});

//guest게시판 글 작성 
router.post('/createBoard',upload.single('img'), function(req, res, next){
    console.log("파일의 원래 이름 : " + req.file.originalname);
    console.log("변경된 파일명 : " + newFile);
    console.log("최종 파일명 : " + newFile);
    
    if(!req.body.title){
        return res.json({state : -1, msg : "Title is empty!"});
    }
    if(!req.body.content){
        return res.json({state : -1, msg : "Content is empty!"});
    }
    if(!req.body.guestId){
        return res.json({state : -1, msg : "guestID is empty!"});
    }

    let writeBoard = new guestBoard();
    guestBoard.findByUserName(req.body.guestId, function(err, userInfo){
        writeBoard.title = req.body.title;
        writeBoard.content = req.body.content;
        writeBoard.Info = userInfo[0];
        console.log(userInfo);
        writeBoard.startDate = req.body.startDate;
        writeBoard.endDate = req.body.endDate;
        // writeBoard.difficulty = req.body.difficulty;
        writeBoard.workDay = req.body.workDay;
        writeBoard.category = req.body.category;

        let preferLocation = req.body.preferLocation;
        let deleteA = preferLocation.replace("[","");
        let deleteB = deleteA.replace("]","");
        console.log(deleteB);
        let abArr = deleteB.split(',');

        writeBoard.preferLocation = abArr;
        writeBoard.candidate = req.body.candidate;
        writeBoard.report = false;

        let canNumber = "";
        if(req.body.candidate){
            canNumber = writeBoard.candidate.length;
            console.log(canNumber);
            writeBoard.candidateNumber = canNumber;
        }
        // console.log("이미지 파일 이름 2 : " + urlName);
        writeBoard.boardImg = "http://ec2-15-164-103-237.ap-northeast-2.compute.amazonaws.com:3000/images/guestBoard/"+newFile;
        // writeBoard.boardImg = "http://ec2-15-164-103-237.ap-northeast-2.compute.amazonaws.com:3000/images/guestBoard/"+urlName+".jpeg";
        // writeBoard.boardImg = "http://localhost:3000/images/guestBoard/"+req.body.guestId+today+".jpeg";
        writeBoard.save(function(err){
            if(err){
                console.log(err);
                return res.json({state : -1, msg : "guestBoard save is failed"});
            }
            res.json({state : 0, msg : "guestBoard save is success"});
        })
    });

})



   
module.exports = router;