import { Card, CardContent, Typography, Grid, Box } from '@mui/material'
import React from 'react'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import { grey } from '@mui/material/colors'
import useAlert from '../contexts/AlertContext/useAlert'
import moment from 'moment'



const History = ({ history }) => {
  const [doctorId,personId,timestamp] = history


  const {setAlert} = useAlert()
  // const [b64,setb64] = useState("")



  return (
    <>
   
      <Card>
      <CardContent>
        <Grid container spacing={2}>
         <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
  <Grid item xs={6}>
    <Typography>{personId}</Typography>
  </Grid>
  <Grid item xs={6}>
    <Typography>{doctorId}</Typography>
  </Grid>
   <Grid item xs={6}>
    <Typography variant='h6'>{moment.unix(timestamp).format('MM-DD-YYYY HH:mm')}</Typography>
  </Grid>
      </Grid>
        </Grid>
      </CardContent>
    </Card>

   
    </>
    
  )
}


export default History
