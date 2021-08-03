import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function AlertDialog(props) {


  const [value, setValue] = React.useState(null);


  return (

    <Dialog
      open={props.open}
      TransitionComponent={Transition}

      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {props.text}
        </DialogContentText>

        {props.textField ?
          <TextField
            autoFocus
            margin="dense"
            id="value"
            defaultValue={props.textField.value}

            label={props.textField.label}
            type={props.textField.type}
            onFocus={e => e.target.select()}
            onChange={e => setValue(e.target.value)}
            onKeyUp={(e) => {
              console.log('  key pressed', e.key);
              if (e.key === 'Escape') {

                props.cancel();
                return;
              }

              if (e.key === 'Enter') {

                props.confirm(value);
                return;
              }

            }}
            fullWidth
            required

          />
          : null}
      </DialogContent>
      <DialogActions>
        {props.cancel ?
          <Button onClick={props.cancel}  >
            {props.cancelLabel}
          </Button> : null

        }
        <Button onClick={(e) => props.confirm(value)} >
          {props.confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>

  );
}