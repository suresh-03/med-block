import { Card, CardContent, Typography, Grid, Box } from '@mui/material'
import React from 'react'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import { grey } from '@mui/material/colors'
import useAlert from '../contexts/AlertContext/useAlert'
import Proof from './Proof'




const ResearchEntity = ({ entity }) => {
  const [entityId,proofCID] = entity


  const {setAlert} = useAlert()
  // const [b64,setb64] = useState("")



  return (
    <>
   
      <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <DescriptionRoundedIcon style={{ fontSize: 40, color: grey[700] }} />
          </Grid>
          <Grid item xs={3}>
            <Box display='flex' flexDirection='column'>
              <Typography variant='h6' color={grey[600]}>
                Research Entity ID
              </Typography>
              <Typography variant='h6'>{entityId}</Typography>
            </Box>
          </Grid>
           <Grid item xs={10}>
            <Box display='flex' flexDirection='column'>
              <Typography variant='h6' color={grey[600]}>
                ID Proof
              </Typography>
              {proofCID.length != 0 ? (
              <Proof proof={proofCID}/>
                ) : (

                setAlert("No Proof Exists",'error')
                )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>

   
    </>
    
  )
}


export default ResearchEntity
