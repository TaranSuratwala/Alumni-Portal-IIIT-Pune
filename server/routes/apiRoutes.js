const express = require('express');
const { sendOtp, signUp, login } = require('../controllers/Auth');
const { auth, isAlumni, isStudent, isAdmin, allowDelete } = require('../middlewares/auth');
const { updateAlumniProfile, updateStudentProfile, getAllAlumni, getUser, getAlumni, getUser2, updateProfilePicture, updateAdminProfile } = require('../controllers/Profile');
const { createPost, getAllPosts, deletePost } = require('../controllers/Post');
const { createEvent, getAllEvents, updateInterestedCandidate, deleteEvent } = require('../controllers/Event');
const { createNotice, getAllNotices, deleteNotice } = require('../controllers/Notice');
const mailSender = require('../utils/mailsender');
const MailSender = require('../controllers/MailSender');
const { createTicket, getAllTickets, getMyTickets, sendMessage, updateStatus } = require('../controllers/Ticket');

const router = express.Router();

router.post('/send-otp',sendOtp);
router.post('/signup',signUp);
router.post('/login',login);
router.post('/update-alumni-profile',auth,isAlumni ,updateAlumniProfile);
router.post('/update-student-profile',auth,isStudent,updateStudentProfile);
router.post('/update-admin-profile',auth,isAdmin,updateAdminProfile);
// router.post('/posts/create-post',auth, isAdmin,createPost);
router.post('/posts/create-post',auth, allowDelete,createPost);
router.post('/posts/get-all-posts',getAllPosts);
router.post('/get-all-alumni',auth,getAllAlumni);
router.post('/get-alumni',auth,getAlumni);
router.post('/getUser',auth,getUser);
router.post('/get-user-2',auth,getUser2);
router.post('/event/create-event',auth,isAdmin,createEvent);
router.post('/event/get-all-events',auth,getAllEvents);
router.post('/event/update-candidates',auth,updateInterestedCandidate);
router.post('/notice/create-notice',auth,isAdmin,createNotice);
router.post('/notice/get-all-notices',auth,getAllNotices);
router.post('/contact/send-mail',auth,MailSender);

router.post('/delete/delete-post',auth,allowDelete,deletePost);
router.post('/delete/delete-event',auth,isAdmin,deleteEvent);
router.post('/delete/delete-notice',auth,isAdmin,deleteNotice);

router.post('/ticket/create-ticket',auth,createTicket)
router.post('/ticket/get-all-tickets',auth,getAllTickets)
router.post('/ticket/get-my-tickets',auth,getMyTickets)
router.post('/ticket/send-message',auth,sendMessage)
router.post('/ticket/update-status',auth,isAdmin,updateStatus);

router.post('/update-profile-picture',auth,updateProfilePicture);
router.post('/update-admin-profile',auth,isAdmin,updateAdminProfile);

module.exports = router