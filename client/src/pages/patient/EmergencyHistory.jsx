import React, { useState, useEffect, useContext } from 'react'
import { Box, Typography, Backdrop, CircularProgress,RadioGroup, FormControl,FormControlLabel,Radio} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import CustomButton from '../../components/CustomButton'
import useEth from '../../contexts/EthContext/useEth'
import History from '../../components/History'
import PatientAccess from '../../components/access/patientAccess'


const EmergencyHistory = () => {
  const {
    state: { contract, accounts, role, loading },
  } = useEth()

  const [history,setHistory] = useState([])
  const [viewHistory,setViewHistory] = useState(false)



    const getHistory = async () => {
      try{
        const history = await contract.methods.viewAccessHistory(accounts[0]).call({ from: accounts[0] })
        // console.log(requests)
        setHistory(history)
        setViewHistory(true)
        return
      }catch(err){
        console.error(err)
      }
    }

  if (loading) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    )
  }
  else {
    return (
      <Box display='flex' justifyContent='center' width='100vw'>
        <Box width='60%' my={5}>
          <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress color='inherit' />
          </Backdrop>
          {!accounts ? (
            <Box display='flex' justifyContent='center'>
              <Typography variant='h6'>Open your MetaMask wallet to get connected, then refresh this page</Typography>
            </Box>
          ) : (
            <>
              {role === 'patient' && (
                <>
                  <Box mx={2}>
                      <CustomButton text={'See Requests'} handleClick={() => getHistory()}>
                        <SearchRoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
                    </Box>
                    {history.length > 0 && viewHistory && (
                      <>
                         <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                      {history.map((history, index) => (
                        <Box mb={2}>
                          <History key={index} history={history} />
                        </Box>
                      ))}
                    </Box>
                    <Box mx={2}>
                      <CustomButton text={'Close Requests'} handleClick={() => setViewHistory(false)}>
                        <SearchRoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
                    </Box>
                    </>


                      )}
                </>
              )}
              <PatientAccess role={role}/>
            </>
          )}
        </Box>
      </Box>
    )
  }
}

export default EmergencyHistory
