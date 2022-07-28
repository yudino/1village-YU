import { Modal } from "@mui/material";

interface LightBoxProps {
    img: [];
    title?: string;
    subtitle?: string;
    footer?: React.ReactNode;
   

export const LightBox = () => { 
    return (
        <Modal
            open={true}
            onClose={() => { }}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            closeAfterTransition={true}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            
        >

        </Modal>
    );
};
