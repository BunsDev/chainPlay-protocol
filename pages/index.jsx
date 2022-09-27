import Head from 'next/head'
import Image from 'next/image'
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import lotteryAbi from '../artifacts/contracts/lottery.sol/lottery.json'

const CONTRACT_ADDRESS = '0x491FE88AD62497cb3d60c20122ca43EeF4AD9df1';
export default function Home() {

  const [currentAccount, setCurrentAccount] = useState('');
  const [dataSet, setDataSet] = useState([]);
  const [outputArray, setoutputArray] = useState([]);
  const [diceValue, setdice] = useState([0, 0]);
  let hfyf = true;
  useEffect(() => {
    console.log(outputArray);
    console.log("last value:", outputArray.at(-1));
    setdice([chanceMap[outputArray.at(-1)]])
    console.log("last value:", diceValue);
  }, [hfyf])

  console.log(diceValue);

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

        connectedContract.on('EventGetResultGameTwo', (from, counter, randomNumber, sentAmount) => {
          console.log("rand number ", parseInt(randomNumber._hex))
          console.log("event recorded ", from, parseInt(counter._hex), parseInt(randomNumber._hex), parseInt(sentAmount._hex));
          hfyf= false;
          setoutputArray((ar) => {
            return [...ar, parseInt(randomNumber._hex)]
          });
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
    setDataSet([0, 0, 0.2, 0, 0.5, 0, 0, 0, 0, 0, 0, 0]);
    console.log("last value dataset", dataSet.at(-1));
    let arr = [6]
    console.log("last value arr", arr.at(-1), arr[0]);
  }, [])

  let dotMap = {
    0: [],
    1: [5],
    2: [4, 6],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 7, 9, 5],
    6: [1, 2, 3, 7, 8, 9],
  }

  let chanceMap = {
    '2': [1, 1],
    '3': [1, 2],
    '4': [2, 2],
    '5': [3, 2],
    '6': [3, 3],
    '7': [4, 3],
    '8': [4, 4],
    '9': [5, 4],
    '10': [5, 5],
    '11': [6, 5],
    '12': [6, 6]
  }
  const DiceComp = ({ diceValue }) => {

    console.log(diceValue)

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
            <>{
              diceValue ? <DiceComp diceValue={diceValue} /> : <></>
            }
              
              <RewardarrayComp dataSet={dataSet} />
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

  let rewardArray = dataSet;
  console.log(dataSet);
  return (
    <table className='rewards'>
      <tr>
        <th>Number</th>
        <th>Reward</th>
      </tr>
      {
        rewardArray.map((ele, idx) => {
          return (
            <tr key={ele + idx}>
              <td>{idx + 1}</td>
              <td>{ele} MATIC</td>
            </tr>
          )
        })
      }

    </table>

  )

}

const WinnerUpdateComp = ({ winnerDataSet }) => {

  let trimAddress = (str) => {
    return str.slice(0, 8) + '...' + str.slice(-5)
  }

  return (

    <table className='rewards winner'>
      <tr>
        <th>Address</th>
        <th>Reward</th>
      </tr>
      <tr>
        <td>{trimAddress('1dfjsofscijosdfwosidfmcowinefo')}</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>{trimAddress('1dfjsofscijosdfwosidfmcowinefo')}</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>{trimAddress('1dfjsofscijosdfwosidfmcowinefo')}</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>{trimAddress('1dfjsofscijosdfwosidfmcowinefo')}</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>{trimAddress('1dfjsofscijosdfwosidfmcowinefo')}</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>{trimAddress('1dfjsofscijosdfwosidfmcowinefo')}</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>{trimAddress('1dfjsofscijosdfwosidfmcowinefo')}</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>{trimAddress('1dfjsofscijosdfwosidfmcowinefo')}</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>{trimAddress('1dfjsofscijosdfwosidfmcowinefo')}</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>{trimAddress('1dfjsofscijosdfwosidfmcowinefo')}</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>{trimAddress('1dfjsofscijosdfwosidfmcowinefo')}</td>
        <td>0 MATIC</td>
      </tr>
      <tr>
        <td>{trimAddress('1dfjsofscijosdfwosidfmcowinefo')}</td>
        <td>0 MATIC</td>
      </tr>
    </table>


  )
}