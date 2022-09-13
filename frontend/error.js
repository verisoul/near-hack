import {Alert, Collapse, IconButton, Box} from "@mui/material";
import {useState} from "react";
import CloseIcon from '@mui/icons-material/Close';

function ErrorMessage({ message }) {
    const [open, setOpen] = useState(true);
    if(!message){
        return null
    }

    return (
        <Box sx={{width: '100%'}}>
            <Collapse in={open}>
                <Alert
                    variant={'filled'}
                    severity={'error'}
                    action={
                        <IconButton
                            aria-label={'close'}
                            color={'inherit'}
                            size={'medium'}
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CloseIcon fontSize={'inherit'}/>
                        </IconButton>
                    }
                >
                    {message}
                </Alert>
            </Collapse>
        </Box>
    )
}

export default ErrorMessage