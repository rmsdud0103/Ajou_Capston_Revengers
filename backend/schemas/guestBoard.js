const {mongoose, autoIncrement} = require('./index');

const guestBoardSchema = new mongoose.Schema({
    //db에 저장하는 id 자동적으로 1씩 증가 
    guestBoardId:{
        type : Number,
        unique : true     
    },
    title:{
        type : String,
        required : true
    },
    content :{
        type : String,
        required : true
    },
    guestInfo : {
        type : String,
        required : true
    },
    date : {
        type : Date,
    },
    difficulty :{
        type : Number
    },
    workDay : {
        type : Number
    },
    category : {
        type : String
    },
    preferLocation : {
        type : String
    },
    candidate :{
        type : Array
    },
    candidateNumber : {
        type : Number
    }
})

guestBoardSchema.plugin(autoIncrement,{
    model : 'hostBoard',
    field : 'hostBoardId',
    startAt : 1
})

module.exports = mongoose.model('hostBoard', hostBoardSchema);
