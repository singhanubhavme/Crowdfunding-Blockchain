import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Avatar } from 'web3uikit';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    IconButton,
    Typography,
    CardMedia,
    Button
} from '@mui/material';
import { useNotification } from "web3uikit";

import ABI from "../constants/abi.json";
import ContractAddress from "../constants/contractAddress.json";

const theme = createTheme();

let funderContract;

export default function Donate() {

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

    async function getAllFunders(setFunders) {
        setFunders(await funderContract.getAllFunders());
    }

    const [funders, setFunders] = useState([]);
    const [amount, setAmount] = useState(0);
    const [isButtonDisabled, setisButtonDisabled] = useState(false);

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
                getAllFunders(setFunders);
            }
        })();
    }, []);

    const handleClick = async (e, funder) => {
        funderContract.donateToFundme(funder[0], { value: amount })
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
        setAmount(0);
    }

    return (
        <ThemeProvider theme={theme}>
            <div style={{ paddingTop: '5em' }}></div>
            <Typography variant="h4" component="h5" style={{ textAlign: 'center' }}>
                Donate to Fundraisers
            </Typography>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {
                    funders.map((funder) => {
                        return (
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

                                        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                                            <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
                                            <Input
                                                onChange={(e) => setAmount(e.target.value)}
                                                id="standard-adornment-amount"
                                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                name="amount"
                                            />
                                        </FormControl>
                                        <Button
                                            disabled={isButtonDisabled}
                                            onClick={(e) => handleClick(e, funder)}
                                            variant="contained"
                                            style={{ margin: 'auto' }}>
                                            Donate
                                        </Button>

                                    </CardActions>

                                </Card>
                            </div>
                        );
                    })
                }
            </div>

        </ThemeProvider>
    );
}


