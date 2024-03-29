const express=require('express')
const cors=require('cors')

const app=express()

const GetVideo=require('./GetVideo')
const GetAudio=require('./GetAudio')

const PORT=process.env.PORT||8082;

app.use(cors({credentials: true}))
app.use(express.json())

app.get('/',(req,res)=>{
	res.json('ok')
})


app.post('/getVideoLink',async(req,res)=>{
	const {url,q}=req.body
	console.log('post url: ',url)
	const obj=await GetVideo(url,q)

	console.log('obj video: ',obj)

	res.json(obj)
})

app.post('/getAudioLink',async(req,res)=>{
	const {url}=req.body
	const obj=await GetAudio(url)

	console.log('obj audio: ',obj)
	res.json(obj)
})

app.listen(PORT,()=>{
	console.log('app is running in PORT ' ,PORT)
})


// export 'app'
// module.exports = app