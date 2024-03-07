import { Card, CardContent, Typography, Grid, Box } from '@mui/material'
import React from 'react'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import { grey } from '@mui/material/colors'
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import useEth from '../contexts/EthContext/useEth'
import useAlert from '../contexts/AlertContext/useAlert'
import Proof from './Proof'
import {useState} from 'react'
import CheckIcon from '@mui/icons-material/Check';




const RequestEntity = ({ requestEntity }) => {
  const [entityId,doctorId,access] = requestEntity
  const [entityData,setEntityData] = useState([])
  const [verifyEntityClick,setVerifyEntityClick] = useState(false)

   const {
    state: { contract, accounts, role, loading },
  } = useEth()

  const {setAlert} = useAlert()
  // const [b64,setb64] = useState("")

  const givePermission = async (entityId,access) => {
    try{
      await contract.methods.grantResearchAccess(entityId,access).send({ from: accounts[0] })
      if(access){
        setAlert("request granted","success")
      }
      else{
        setAlert("request rejected","error")
      }

    }catch(err){
      alert(err);
    }
  }
  const verifyEntity = async () => {
  try{
  const entityData = await contract.methods.verifyResearchEntityProof(entityId).call({from:accounts[0]})
  setEntityData(entityData)
  setVerifyEntityClick(true)
}
catch(err){
  console.error(err)
}
}


 
 


  return (
    <>
   
      <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <DescriptionRoundedIcon style={{ fontSize: 40, color: grey[700] }} />
          </Grid>
          <Grid item xs={5}>
            <Box display='flex' flexDirection='column'>
              <Typography variant='h6' color={grey[600]}>
                Research Entity ID
              </Typography>
              <Typography variant='h6'>{entityId}</Typography>
            </Box>
          </Grid>
          <Grid item xs={5}>
            <Box display='flex' flexDirection='column'>
              <Typography variant='h6' color={grey[600]}>
                Doctor ID
              </Typography>
              <Typography variant='h6'>{doctorId}</Typography>
            </Box>
          </Grid>
          
           <Grid item xs={10}>
            <Box display='flex' flexDirection='column'>
              <Typography variant='h6' color={grey[600]}>
                Access
              </Typography>
              <Typography variant='h6'>{access.toString()}</Typography>
            </Box>
          </Grid>
            <Grid item xs={10}>
            <Box display='flex' flexDirection='column'>
              <Typography variant='h6' color={grey[600]}>
                Access
              </Typography>
               <Box mx={2} display='flex' flexDirection='row'>
                      <Stack direction="row" spacing={2}>
      <Button variant="contained" color='error' value={entityId} startIcon={<DeleteIcon />} onClick={(e) => givePermission(e.target.value,false)}>
        Reject
      </Button>
      <Button variant="contained" color='success' value={entityId} endIcon={<SendIcon />} onClick={(e) => givePermission(e.target.value,true)}>
        Accept
      </Button>
      <Button variant="contained" color='primary'  endIcon={<CheckIcon />} onClick={() => verifyEntity()}>
        Verify Entity
      </Button>
    </Stack>
                </Box>
            </Box>
          </Grid>
            <Grid item xs={10}>
            <Box display='flex' flexDirection='column'>
              <Typography variant='h6' color={grey[600]}>
                Entity ID Proof
              </Typography>
              {entityData.length != 0 && verifyEntityClick && (
              <Proof proof={entityData}/>
                )}
              {entityData.length == 0 && verifyEntityClick && (
                setAlert('No Proof Exists','error')
                )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>

   
    </>
    
  )
}


export default RequestEntity
