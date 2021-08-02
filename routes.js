const router = require("express").Router();
const {signup,signup_password} = require('./services/inputValidation');


//User routes
router.use('/api/', signup, require('./controllers/signup'));
router.use('/api/', require('./controllers/signin'));
router.use('/api/', require('./controllers/checkemail'));
router.use('/api/', require('./controllers/usertype'));
router.use('/api/', require('./controllers/updateProfile'));
router.use('/api/', signup_password, require('./controllers/forgotPassword'));
router.use('/api/', require('./controllers/logOut'));
router.use('/api/', require('./controllers/referFriendHistory'));
router.use('/api/', require('./controllers/getUserById'));

router.use('/api/', require('./controllers/feedback'));
router.use('/api/', require('./controllers/rating'));
router.use('/api/', require('./controllers/getUserWalletBalanceById'));
// Movie routes
router.use('/api/', require('./controllers/addMovieMaster'));
router.use('/api/', require('./controllers/movieLanguage'));
router.use('/api/', require('./controllers/movieCategory'));
router.use('/api/', require('./controllers/genreUser'));
router.use('/api/', require('./controllers/addMoviePlayer'));
router.use('/api/', require('./controllers/addMovieCast'));
router.use('/api/', require('./controllers/addMovieLink'));
router.use('/api/', require('./controllers/addMovieContract'));
router.use('/api/', require('./controllers/addKycData'));
router.use('/api/', require('./controllers/getContractDetails'));
router.use('/api/', require('./controllers/getKycData'));
router.use('/api/', require('./controllers/updateKyc'));
router.use('/api/', require('./controllers/getUserMovieList'));
router.use('/api/', require('./controllers/getAllMovie'));
router.use('/api/', require('./controllers/getAllTableMovieDetails'));
router.use('/api/', require('./controllers/getMovieByCategory'));
router.use('/api/', require('./controllers/otplogin'));
router.use('/api/', require('./controllers/allLatestMovie'));
router.use('/api/', require('./controllers/getHomePageMovie'));
router.use('/api/', require('./controllers/getMovieById'));
router.use('/api/', require('./controllers/getMovieCastById'));
router.use('/api/', require('./controllers/getMoviePlayerById'));
router.use('/api/', require('./controllers/getMovieLinkById'));
router.use('/api/', require('./controllers/getContractdtlsById'));
router.use('/api/', require('./controllers/googlelogin'));
router.use('/api/', require('./controllers/getUploadDetailsByProducer'));
router.use('/api/', require('./controllers/producerWalletBalance'));
router.use('/api/', require('./controllers/producerWholeMovieDetails'));
router.use('/api/', require('./controllers/userTransactionHistory'));
router.use('/api/', require('./controllers/getBasicMovieDetailsById'));
router.use('/api/', require('./controllers/getMovieTitleSearch'));
router.use('/api/', require('./controllers/addMovieTransactionByWallet'));
router.use('/api/', require('./controllers/getProducerLiveCastdtls'));
router.use('/api/', require('./controllers/addProducerLiveCast'));
router.use('/api/', require('./controllers/getProducerLiveCastById'));
router.use('/api/', require('./controllers/getHomeMoviebyCategory'));
router.use('/api/', require('./controllers/getHomeMovieByIdandCategory'));

// Admin routes
router.use('/api/', require('./controllers/addApprovaldtls'));
router.use('/api/', require('./controllers/getApproveType'));

router.use('/api/', require('./controllers/addMovieTracsaction'));

router.use('/api/', require('./controllers/razorPay'));


router.use('/api/', require('./controllers/forgotPasswordLink'));
router.use('/api/', require('./controllers/changePassword'));

router.use('/api/', require('./controllers/shareWith'));
router.use('/api/', require('./controllers/referTran'));



router.use('/api/', require('./controllers/getAllLivecastCurrentMovie'));
router.use('/api/', require('./controllers/getAllLivecastPreviousMovie'));
router.use('/api/', require('./controllers/getAllActivePreviousMovie'));
router.use('/api/', require('./controllers/getAllActiveMovie'));

router.use('/', require('./controllers/addMovieTracsactionPayU'));
router.use('/api/', require('./controllers/getLiveCastByTime'));
router.use('/api/', require('./controllers/getAllLivecastLink'));

router.use('/api/', require('./controllers/checkephone'));



//============================== AWS IMAGE UPLOAD S3 BUCKET ====================================//

let upload = require('./config/multer.config.js');
const awsWorker = require('./controllers/aws.controllerVdo.js');
router.post('/api/file/upload_movie', upload.single("file"), awsWorker.doUpload);

const awsWorkerTrailer1 = require('./controllers/aws.controllerTrailer1.js');
router.post('/api/file/upload_trailer1', upload.single("file"), awsWorkerTrailer1.doUpload);

const awsWorkerTrailer2 = require('./controllers/aws.controllerTrailer2.js');
router.post('/api/file/upload_trailer2', upload.single("file"), awsWorkerTrailer2.doUpload);

const awsWorkerBanner1 = require('./controllers/aws.controllerBanner1.js');
router.post('/api/file/upload_banner1', upload.single("file"), awsWorkerBanner1.doUpload);

const awsWorkerBanner2 = require('./controllers/aws.controllerBanner2.js');
router.post('/api/file/upload_banner2', upload.single("file"), awsWorkerBanner2.doUpload);

const awsWorkerScreenshot1 = require('./controllers/aws.controllerScreenshot1.js');
router.post('/api/file/upload_screenshot1', upload.single("file"), awsWorkerScreenshot1.doUpload);

const awsWorkerScreenshot2 = require('./controllers/aws.controllerScreenshot2.js');
router.post('/api/file/upload_screenshot2', upload.single("file"), awsWorkerScreenshot2.doUpload);

const awsWorkerScreenshot3 = require('./controllers/aws.controllerScreenshot3.js');
router.post('/api/file/upload_screenshot3', upload.single("file"), awsWorkerScreenshot3.doUpload);

const awsWorkerScreenshot4 = require('./controllers/aws.controllerScreenshot4.js');
router.post('/api/file/upload_screenshot4', upload.single("file"), awsWorkerScreenshot4.doUpload);

const awsWorkerPlayer1 = require('./controllers/aws.controllerPlayer1.js');
router.post('/api/file/upload_ImagePlayer1', upload.single("file"), awsWorkerPlayer1.doUpload);

const awsWorkerPlayer2 = require('./controllers/aws.controllerPlayer2.js');
router.post('/api/file/upload_ImagePlayer2', upload.single("file"), awsWorkerPlayer2.doUpload);

const awsWorkerPlayer3 = require('./controllers/aws.controllerPlayer3.js');
router.post('/api/file/upload_ImagePlayer3', upload.single("file"), awsWorkerPlayer3.doUpload);

const awsWorkerPlayer4 = require('./controllers/aws.controllerPlayer4.js');
router.post('/api/file/upload_ImagePlayer4', upload.single("file"), awsWorkerPlayer4.doUpload);

const awsWorkerPlayer5 = require('./controllers/aws.controllerPlayer5.js');
router.post('/api/file/upload_ImagePlayer5', upload.single("file"), awsWorkerPlayer5.doUpload);

const awsWorkerPlayer6 = require('./controllers/aws.controllerPlayer6.js');
router.post('/api/file/upload_ImagePlayer6', upload.single("file"), awsWorkerPlayer6.doUpload);

const awsWorkerPlayer7 = require('./controllers/aws.controllerPlayer7.js');
router.post('/api/file/upload_ImagePlayer7', upload.single("file"), awsWorkerPlayer7.doUpload);

const awsWorkerPlayer8 = require('./controllers/aws.controllerPlayer8.js');
router.post('/api/file/upload_ImagePlayer8', upload.single("file"), awsWorkerPlayer8.doUpload);

const awsWorkerCensor = require('./controllers/aws.controllerCensor.js');
router.post('/api/file/upload_CensorCertificate', upload.single("file"), awsWorkerCensor.doUpload);

const awsWorkerPan = require('./controllers/aws.controllerKycPan.js');
router.post('/api/file/upload_PanImage', upload.single("file"), awsWorkerPan.doUpload);

const awsWorkerCheque = require('./controllers/aws.controllerKycCheque.js');
router.post('/api/file/upload_ChequeImage', upload.single("file"), awsWorkerCheque.doUpload);

const awsWorkerProfilePic = require('./controllers/aws.controllerProfilePic');
router.post('/api/file/upload_ProfilePic', upload.single("file"), awsWorkerProfilePic.doUpload);

router.use('/', require('./controllers/awsMultipartVdo'));



module.exports = router;