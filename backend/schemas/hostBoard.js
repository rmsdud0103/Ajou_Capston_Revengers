const {mongoose, autoIncrement} = require('./index');

const hostBoardSchema = new mongoose.Schema({
    //db에 저장하는 id 자동적으로 1씩 증가 
    hostBoardId:{
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
    hostInfo : {
        type : String,
        required : true
    },
    boardImg : {
        type : String
    },
    startDate : {
        type : Date,
    },
    endDate:{
        type : Date,
    },
    difficulty :{
        type : Number,
        required : true
    },
    workDay : {
        type : Number
    },
    category : {
        type : String
    },
    reward : {
        type : String
    },
    candidate :{
        type : Array
    },
    candidateNumber : {
        type : Number
    }
})

hostBoardSchema.plugin(autoIncrement,{
    model : 'hostBoard',
    field : 'hostBoardId',
    startAt : 1
})

module.exports = mongoose.model('hostBoard', hostBoardSchema);
