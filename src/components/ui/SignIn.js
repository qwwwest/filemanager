import React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
      marginTop: "8px",
      borderRadius: "24px",
      opacity: .4,
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
      borderRadius: "24px",
      opacity: .4,

    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
      borderRadius: "24px",
      opacity: 1,
    },
    "& .MuiOutlinedInput-input": {
      color: "white",
      borderRadius: "24px",
      opacity: .4,
    },
    "&:hover .MuiOutlinedInput-input": {
      color: "white",
      borderRadius: "24px",
      opacity: 1,
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
      color: "white",
      borderRadius: "24px",
      opacity: 1,
    },
    "& .MuiInputLabel-outlined": {
      color: "white",
      borderRadius: "24px",
      opacity: .4,
    },
    "&:hover .MuiInputLabel-outlined": {
      color: "white",
      borderRadius: "24px",
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: "white",
      borderRadius: "24px",
      opacity: 1,
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(8),
    backgroundColor: "#ffffff",
    opacity: .4,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: "transparent",
    border: "1px solid #ffffff",
    opacity: .4,
    "&:hover": {
      opacity: 1,
      backgroundColor: "transparent",

    }
  },
}));



const useInput = initialValue => {
  const [value, setValue] = React.useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: event => {
        setValue(event.target.value);
      }
    }
  };
};


export default function SignIn(props) {
  const classes = useStyles();
  const login = useInput('');
  const pwd = useInput('');




  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>

        <form className={classes.form} noValidate onSubmit={(event) => {
          event.preventDefault();
          props.onSubmit(login.value, pwd.value);
        }}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="login"
            label="Login"
            name="login"
            className={classes.root}
            value={login.value}
            onChange={event => login.setValue(event.target.value)}
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            className={classes.root}
            value={pwd.value}
            onChange={event => pwd.setValue(event.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}

          >
            Log In
          </Button>

        </form>
        {props.message}
      </div>

    </Container>
  );
}
