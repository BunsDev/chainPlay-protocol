import Head from 'next/head'
import Image from 'next/image'
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import lotteryAbi from '../artifacts/contracts/lottery.sol/lottery.json'

const CONTRACT_ADDRESS = '0x5CD4587CeB0744B75BC5E84D97C89586dcaE4067';
export default function Home() {

  const [currentAccount, setCurrentAccount] = useState('');
  const [dataSet, setDataSet] = useState([]);
  const getRandomDiceNumber = async () => {
    try {
      //const { ethereum } = window;
      await window.ethereum;
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          lotteryAbi.abi,
          signer
        );
        let feeTOCall = await connectedContract.fees();
        console.log('Going to pop window for gas fee', feeTOCall.toString());
        setDataSet[0, 0, 0.2, 0, 0.5, 0, 0, 0, 0, 0, 0, 0];
        const options = { value: ethers.utils.parseEther("0.1") }
        let deployedtxn = await connectedContract.getRandomDiceNumber(options);

        console.log('Minning the NFT..');
        await deployedtxn.wait();

        console.log(
          `Check number, see transaction: https://mumbai.polygonscan.com/tx/${deployedtxn.hash
          }`
        );


      } else {
        console.log('Ethereum object does not exist..');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setupEventListner = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          lotteryAbi.abi,
          signer
        );
        connectedContract.on('EventGetResultGameTwo', (from, counter, randomNumber) => {
          console.log("event recorded ", from, counter, ethers.BigNumber(randomNumber._hex));
          <DiceComp diceValue={[6, 5]} />
        })
        console.log('Setup event listener!');
      } else {
        console.log('Ethereum object does not exist..');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const checkConnectedWallet = async () => {
    const { ethereum } = window;

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log(accounts)
    if (accounts.length !== 0) {
      const account = accounts[0];

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("The Chain Id is : " + chainId);

      const chainIdRinkeby = "0x1";
      if (chainId !== chainIdRinkeby) {
        console.log("Check if your metamask is connected to Ethereum Mainnet")
      }


      console.log('Authorized account found: ', account);
      return;
    } else {
      console.log('No authorised account found');
    }
  };

  const connectWallet = async () => {
    const { ethereum } = window;
    await window.ethereum.enable()
    if (!ethereum) {
      alert('Get Metamask..!');
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    console.log('Connected to: ', accounts[0]);
    setCurrentAccount(accounts[0]);
    setDataSet[0, 0, 0.2, 0, 0.5, 0, 0, 0, 0, 0, 0, 0];
    setupEventListner();
  };

  const renderNotConnectedContainer = () => {
    <button
      onClick={connectWallet}
      className="button">
      Connect to Wallet
    </button>
  };

  useEffect(() => {
    checkConnectedWallet()
    setDataSet[0, 0, 0.2, 0, 0.5, 0, 0, 0, 0, 0, 0, 0];
  })

  let dotMap = {
    1: [5],
    2: [4, 6],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 7, 9, 5],
    6: [1, 2, 3, 7, 8, 9],
  }

  const DiceComp = ({ diceValue }) => {

    return (

      <section className='section dice-sec' >
        <div className="dice throw_animation">
          {
            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => {
              return <span className='dice_unit'>
                {
                  (dotMap[diceValue[0]].includes(idx)) ?
                    <span className="dot">

                    </span> :
                    <span className="blank">

                    </span>
                }
              </span>
            })
          }
        </div>
        <div className="dice throw_animation">
          {
            [1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => {
              return <span className='dice_unit'>
                {
                  (dotMap[diceValue[1]].includes(idx)) ?
                    <span className="dot">

                    </span> :
                    <span className="blank">

                    </span>
                }
              </span>
            })
          }
        </div>
        <button className="throw" onClick={getRandomDiceNumber}>
          throw
        </button>
      </section>

    )
  }


  return (
    <div className="container">
      <Head>
        <title>GameChain</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">
          <a href="www.dheeraj.lol">ChainPlay</a>
        </h1>
        <nav className="navbar">
          {
            currentAccount ?
              <p  >{currentAccount}</p> :
              <button className="btn-connect-wallet" onClick={() => connectWallet()}>Connect</button>

          }
        </nav>
        {
          currentAccount ?
            <>
              <DiceComp diceValue={[6, 6]} />
              <RewardarrayComp />
              <WinnerUpdateComp winnerDataSet={[[1, 2], [3, 4]]} />
            </>
            :
            <section className='section' >
              <img src="/pngwing.png" ></img>
              <h2>Connect wallet to enter the chainPlay world</h2>
            </section>
        }

      </main>

      <footer className="footer">
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className="logo">
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div >
  )
}

// let dotMap = {
//   1: [5],
//   2: [4, 6],
//   3: [1, 5, 9],
//   4: [1, 3, 7, 9],
//   5: [1, 3, 7, 9, 5],
//   6: [1, 2, 3, 7, 8, 9],
// }

// const DiceComp = ({ diceValue }) => {

//   return (

//     <section className='section dice-sec' >
//       <div className="dice throw_animation">
//         {
//           [1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => {
//             return <span className='dice_unit'>
//               {
//                 (dotMap[diceValue[0]].includes(idx)) ?
//                   <span className="dot">

//                   </span> :
//                   <span className="blank">

//                   </span>
//               }
//             </span>
//           })
//         }
//       </div>
//       <div className="dice throw_animation">
//         {
//           [1, 2, 3, 4, 5, 6, 7, 8, 9].map((idx) => {
//             return <span className='dice_unit'>
//               {
//                 (dotMap[diceValue[1]].includes(idx)) ?
//                   <span className="dot">

//                   </span> :
//                   <span className="blank">

//                   </span>
//               }
//             </span>
//           })
//         }
//       </div>
//       <button className="throw" onClick={() => getRandomDiceNumber()}>
//         throw
//       </button>
//     </section>

//   )
// }

const RewardarrayComp = ({ dataSet }) => {
  console.log('dataset', dataSet)

  return (
    <table className='rewards'>
      <tr>
        <th>Number</th>
        <th>Reward</th>
      </tr>
      <tr>
        <td>1</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>2</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>3</td>
        <td>1 MATIC</td>
      </tr>
      <tr>
        <td>4</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>5</td>
        <td>2 MATIC</td>
      </tr>
      <tr>
        <td>6</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>7</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>8</td>
        <td>0.4 MATIC</td>
      </tr>
      <tr>
        <td>9</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>10</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>11</td>
        <td>0.5 MATIC</td>
      </tr>
      <tr>
        <td>12</td>
        <td>0 MATIC</td>
      </tr>
    </table>

  )

}

const WinnerUpdateComp = ({ winnerDataSet }) => {
  return (
    
    <table className='update-reward '>
        <tr>
          <th>Address</th>
          <th>Reward</th>
        </tr>
        <tr>
          <td>1dfjsofscijosdfwosidfmcowinefo</td>
          <td>0 MATIC</td>
        </tr>
        <tr>
          <td>1dfjsofscijosdfwosidfmcowinefo</td>
          <td>0 MATIC</td>
        </tr>
      </table>


  )
}