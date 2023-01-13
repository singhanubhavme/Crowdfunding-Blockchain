import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { Avatar } from 'web3uikit';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotification } from "web3uikit";
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    IconButton,
    Typography,
    CardMedia,
    Button
} from '@mui/material';

import ABI from "../constants/abi.json";
import ContractAddress from "../constants/contractAddress.json";

const theme = createTheme();

let funderContract;

async function getFunder(setFunder, ownerAddress) {
    setFunder(await funderContract.getFunder(ownerAddress))
}

export default function ClaimBalance() {

    const [funder, setFunder] = useState([]);
    const [isButtonDisabled, setisButtonDisabled] = useState(false);

    const dispatch = useNotification();

    const handleNotification = (type, msg, icon) => {
        dispatch({
            type: type,
            message: msg,
            title: "Tx Notification",
            position: "bottomL",
            icon: icon
        })
    }

    useEffect(() => {
        (async function () {
            if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
                const ethereum = window.ethereum;
                const accounts = await ethereum.request({
                    method: "eth_requestAccounts",
                })
                const provider = new ethers.providers.Web3Provider(ethereum);
                const walletAddress = accounts[0];
                const signer = provider.getSigner(walletAddress);
                const funderAddress = ContractAddress["5"][0];
                funderContract = new ethers.Contract(funderAddress, ABI, signer);
                await getFunder(setFunder, walletAddress);
            }
        })();
    }, []);

    const handleClick = async (e) => {
        console.log(funder);
        funderContract.claimBalance()
            .then((tx) => {
                handleNotification('info', 'Transaction Pending Please Wait!', <NotificationsIcon />);
                setisButtonDisabled(true);
                return tx;
            })
            .then((tx) => tx.wait(1))
            .then(() => {
                handleNotification('info', 'Transaction Complete!', <NotificationsIcon />)
                setisButtonDisabled(false);
            })
            .catch(() => handleNotification('error', 'Transaction Failed!', <NotificationsIcon />))
    }

    return (
        <ThemeProvider theme={theme}>
            <div style={{ paddingTop: '5em' }}></div>
            <Typography variant="h4" component="h5" style={{ textAlign: 'center' }}>
                Claim Balance
            </Typography>
            {
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                    {funder.length !== 0 &&
                        <div key={funder[0]} style={{ margin: '10px', paddingTop: '2em' }}>
                            <Card sx={{ maxWidth: 345 }}>
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            isRounded
                                            theme="image"
                                        />
                                    }
                                    title={funder[1]}
                                    subheader={funder[3]}
                                />
                                <CardMedia
                                    component="img"
                                    height="194"
                                    image={funder[4]}
                                    alt="fundraiser image"
                                />
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        {funder[2]}
                                    </Typography>
                                </CardContent>

                                <CardActions style={{ flexDirection: 'column', alignItems: 'flex-start' }}>

                                    <IconButton aria-label="money">
                                        Target : <AttachMoneyIcon />{JSON.parse(funder[5])}
                                    </IconButton>

                                    <IconButton aria-label="money" style={{ marginLeft: '0' }}>
                                        Balance : <AttachMoneyIcon />{JSON.parse(funder[7])}
                                    </IconButton>

                                    <Button
                                        onClick={(e) => handleClick(e)}
                                        disabled={isButtonDisabled}
                                        variant="contained"
                                        style={{ margin: 'auto' }}>
                                        Claim
                                    </Button>

                                </CardActions>

                            </Card>
                        </div>
                    }
                </div>
            }

        </ThemeProvider>
    );
}


