// Home.js
import React,{useState} from 'react';
import { Button, TextField } from '@mui/material';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../reduxFolder/actions';
import CustomChip from '../uiComponents/avatarChip';
import CustomSnackbar from '../uiComponents/snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Datano from '../mediaFolder/datano.png'
import axios from 'axios';
function Home(props) {
  const [open, setOpen] = React.useState(false);
  const [array,setArray]=useState([])
  const [age,setAge]=useState(1);
  const [gender,setGender]=useState('');
  const [date,setDate]=useState('')
  const [mob,setMob]=useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
   
  };
    const navigate=useNavigate()
    function handleLogout()
    {
      props.logout(); // Dispatch the logout action
    navigate('/'); // Redirect to the login page
    }
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleGender=(e)=>{
      setGender(e.target.value)
    }
    const handleClose = () => {
      setOpen(false);
     setAge(1)
     setMob('')
     setGender('')
     setDate('')
    };
   function handleSubmit()
   {
    if(age.length!==0 && mob.length!==0 && gender.length!==0 && date.length!==0)
    {
      console.log(age,date,gender,mob,props.user.email)
      axios.post('https://login-backend-f1qc.onrender.com/usercredits/updateprofile', {"userAge":age,"userGender":gender,"userDOB":date,"userMobile":mob,"userEmail":props.user.email }, { headers: { 'Content-Type': 'application/json' } })
        .then((response) => {
            const { status } = response;
            if (status===200) {
                handleClose()
                setSnackbarMessage('Customer Updated Successfully!!!!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true); 
            }  
          })
          .catch((error) => {
            if (error.response) {
                if (error.response.status === 500) {
                  // Handle 500 Unauthorized error
                  handleClose()
                  setSnackbarMessage('Failed to update location!');
                  setSnackbarSeverity('warning');
                  setOpenSnackbar(true)
                } else if (error.response.status === 404) {
                  // Handle 404 Not Found error
                  setAge(1)
                setGender('')
                setDate('');
                setMob('')
                 
                  setSnackbarMessage('Invalid user!!!');
                  setSnackbarSeverity('warning');
                  setOpenSnackbar(true)
                } else {
                  // Handle other errors
                  console.error('Error:', error);
                  setSnackbarMessage('An error occurred while making the request.');
                  setSnackbarSeverity('error');
                  setOpenSnackbar(true)
                }
              } else {
                // Handle network errors or other issues
                console.error('Error:', error);
                setSnackbarMessage('An error occurred while making the request.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true)
              }
          });
    }
    else
    {
      setSnackbarMessage('Please provide proper credentials!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
   }
   const handleDate=(e)=>
   {
    const inputValue = e.target.value;

    // Ensure that the input matches the format "yyyy-MM-dd" before updating the state
    if (/^\d{4}-\d{2}-\d{2}$/.test(inputValue)) {
      setDate(inputValue);
    }
   }
   function handleMyProfile()
   {
    axios.get(`https://login-backend-f1qc.onrender.com/usercredits/viewprofile/${props.user.email}`)
    .then((res )=>{
  
      setArray(res.data)
    })
    .catch(error => {
      if (error.response) {
        if (error.response.status === 500) {
          // Handle 500
          alert('Error updating data .');
        } else if (error.response.status === 404) {
          // Handle 404 Not Found error
          alert('User account doesnt exists, create new account!!!');
        } else {
          // Handle other errors
          console.error('Error:', error);
          alert('An error occurred while making the request.');
        }
      } else {
        // Handle network errors or other issues
        console.error('Error:', error);
        alert('An error occurred while making the request.');
      }
    });
   }
   function format(dob)
   {
    const formattedDate = dob.split('T')[0]; 
    return formattedDate;
   }
  return (
    <div>
      {props.isAuthenticated ? (
        <div className='home-container'>
          <h1 style={{textAlign:'center'}}>My Profile</h1>
          <div className='chipdiv'>
          <CustomChip useremailadd={props.user.email || ''}/>
          </div>
          <div className='username-container'>
          <h1>Welcome!!!</h1>
          <Button variant='contained' color='secondary' onClick={handleLogout}>LOG OUT</Button>
          </div>
          <h3>If you are newly registered user means update your profile and view</h3>

          <div className='updatebtn'>
        <Button variant='contained' color='secondary'onClick={handleMyProfile}   >
          VIEW PROFILE 
        </Button>
        </div>
          
            {array.map((element,index)=>(
              <div className='profile-container' key={index}>
                 <h3>Name-{element.userName}</h3>
                 <h3>Age-{element.userAge}</h3>
                 <h3>DOB-{format(element.userDOB)}</h3>
                 <h3>Gender-{element.userGender}</h3>
                 <h3>Mobile Number -{element.userMobile}</h3>
              </div>
            ))}
          
          <div className='updatebtn'>
            <Button variant='contained' color='success' onClick={handleClickOpen} >UPDATE PROFILE</Button>
          </div>
          <Dialog open={open} onClose={handleClose}>
        <DialogTitle>EDIT USER PROFILE</DialogTitle>
        <DialogContent>
        <TextField id="standard-basic" label="AGE" type='number' variant="standard" color="secondary" onChange={(e)=>{setAge(e.target.value)}}/><br/>
        <label>DATE OF BIRTH</label>
        <TextField id='dateInfo' placeholder='yyyy-mm-dd'  variant='standard' color='secondary' type='date' onChange={handleDate}/>
        <div>
             <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">GENDER</FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={gender}
              onChange={handleGender}
            >
              <FormControlLabel value="MALE" control={<Radio />} label="MALE" />
              <FormControlLabel value="FEMALE" control={<Radio />} label="FEMALE" />
            </RadioGroup>
          </FormControl>
             </div>
             <TextField id="standard-basic1" label="MOBILE NUMBER" variant="standard" color="secondary" onChange={(e)=>{setMob(e.target.value)}}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleSubmit}>Edit User Profile</Button>
        </DialogActions>
      </Dialog>
      <CustomSnackbar
                        open={openSnackbar}
                        message={snackbarMessage}
                        severity={snackbarSeverity}
                        onClose={handleSnackbarClose}   
                       
                     />
        
        </div>
      ) : (
        <div className='notlogin-container'>
        <h1 style={{textAlign:'center'}}>You are not logged in.</h1>
        <div className='updatebtn'>
        <img src={Datano} alt='data not found' width={300} height={300}/>
        </div>
        <div className='updatebtn'>
        <Button variant='contained' color='info'onClick={() => navigate('/')} >
          LOG IN 
        </Button>
        </div>
      </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Home);
