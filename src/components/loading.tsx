import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface Props {
  isShow: boolean;
}

export const Loading: React.FC<Props> = (props: Props) => {

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: 999 }}
      open={props.isShow}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}