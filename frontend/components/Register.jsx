import { React, useState, useEffect } from 'react';
import { ethers } from "ethers";
import {
    Button,
    CssBaseline,
    TextField,
    Grid,
    Box,
    Typography,
    Container
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ABI from "../constants/abi.json";
import ContractAddress from "../constants/contractAddress.json";

const theme = createTheme();

let funderContract;

async function registerFundraiser(name, description, email, imageURL, target) {
    await funderContract.registerFundraiser(
        name, description, email, imageURL, target
    );
}

export default function Register() {

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
            }
        })();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const ETHtoUSD = await fetch('https://api.coinbase.com/v2/prices/ETH-USD/spot');
        const targetData = data.get('target');
        const price = (await ETHtoUSD.json()).data.amount;

        const name = data.get('name');
        const email = data.get('email');
        const description = data.get('description');
        const imageURL = data.get('imageURL');
        // const target = targetData / price;
        const target = targetData;

        console.log({
            name: name,
            email: email,
            target: target,
            description: description
        });
        await registerFundraiser(name, description, email, imageURL, target);

    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ marginTop: 5, marginBottom: 3 }}>
                        Register for Fundraiser
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="given-name"
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name of Fundraiser"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    type="number"
                                    name="target"
                                    id="target"
                                    label="Target Amount in $"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="description"
                                    id="description"
                                    label="Description of the Fundraiser"
                                />
                            </Grid>  
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="imageURL"
                                    id="imageURL"
                                    label="URL of an image"
                                />
                            </Grid>

                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}