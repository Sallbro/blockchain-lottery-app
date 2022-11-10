import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useAddress, useDisconnect, useMetamask, useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { ethers } from 'ethers';
import { BarLoader } from 'react-spinners';
import { currency } from '../constant';
import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee";
import AdminControl from '../components/AdminControl';

type props = {
  hours: number,
  minutes: number,
  seconds: number,
  completed: boolean
}

const Home: NextPage = () => {
  //Created check function to see if the MetaMask extension is installed
  // const isMetaMaskInstalled = async () => {
  //   //Have to check the ethereum binding on the window object to see if it's installed
  //   const { ethereum } = window;
  //   console.log("connec");
  //   return Boolean(ethereum && ethereum.isMetaMask);
  // }
  // isMetaMaskInstalled();
  const connectWithMetamask = useMetamask();
  const [quantity, setQuantity] = useState(1);
  const [user_tck, setUser_tck] = useState(0);

  const address = useAddress();
  const disconnect = useDisconnect();
  const { contract, isLoading } = useContract("0x260f8f7236c0Bb3D452a6D0983C4eA7a581c2489");
  const { data: remainingtickets } = useContractRead(contract, "RemainingTickets");
  const { data: currentWinningReward } = useContractRead(contract, "CurrentWinningReward");
  const { data: ticketprice } = useContractRead(contract, "ticketPrice");
  const { data: ticketcommission } = useContractRead(contract, "ticketCommission");
  const { data: expiration } = useContractRead(contract, "expiration");
  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets");
  const { data: gettickets } = useContractRead(contract, "getTickets");
  const { data: winner } = useContractRead(contract, "getWinningsForAddress", address);
  const { mutateAsync: withdrawWinnings } = useContractWrite(contract, "WithdrawWinnings");
  const { data: lastWinner } = useContractRead(contract, "lastWinner");
  const { data: lastWinnerAmount } = useContractRead(contract, "lastWinnerAmount");
  // admin 
  const { mutateAsync: drawwinnerticket } = useContractWrite(contract, "DrawWinnerTicket");
  const { mutateAsync: withdrawcommission } = useContractWrite(contract, "WithdrawCommission");
  const { mutateAsync: restartdraw } = useContractWrite(contract, "restartDraw");
  const { mutateAsync: refundall } = useContractWrite(contract, "RefundAll");
  console.log("address ", address);
  console.log("remainingtickets ", remainingtickets);


  const buytkt = async () => {
    const notf = toast.loading("buying the ticket...");

    if (!ticketprice) {
      return;
    }
    try {
      const data = await BuyTickets([{
        value: ethers.utils.parseEther((Number(ethers.utils.formatEther(ticketprice)) * quantity).toString())
      }]);
      setUser_tck((prev) => (
        prev + quantity
      ));
      toast.success("Ticket purchased succ!", {
        id: notf
      });
    }
    catch (e) {
      toast.error("whoops something went wrong...", {
        id: notf
      });
    }
  }
  const onwithdrawWinnings = async () => {
    const notf = toast.loading("widthdrawing winning amount...");
    try {
      const data = await withdrawWinnings([{}]);
      toast.success("success widthdraw",
        { id: notf });
    } catch (e) {
      toast.error("somthing went wrong try again",
        { id: notf });
    }
  }
  const ondrawwinnerticket = async () => {
    const notf = toast.loading("widthdrawing winning Ticket...");
    try {
      const data = await drawwinnerticket([{}]);
      toast.success("success Ticket draw",
        { id: notf });
    } catch (e) {
      toast.error("somthing went wrong try again",
        { id: notf });
    }
  }
  const onwithdrawcommission = async () => {
    const notf = toast.loading("widthdrawing winning Ticket...");
    try {
      const data = await drawwinnerticket([{}]);
      toast.success("success Ticket draw",
        { id: notf });
    } catch (e) {
      toast.error("somthing went wrong try again",
        { id: notf });
    }
  }
  const onrestartdraw = async () => {
    const notf = toast.loading("widthdrawing winning Ticket...");
    try {
      const data = await restartdraw([{}]);
      toast.success("success Ticket draw",
        { id: notf });
    } catch (e) {
      toast.error("somthing went wrong try again",
        { id: notf });
    }
  }

  const onrefundall = async () => {
    const notf = toast.loading("widthdrawing winning Ticket...");
    try {
      const data = await refundall([{}]);
      toast.success("success Ticket draw",
        { id: notf });
    } catch (e) {
      toast.error("somthing went wrong try again",
        { id: notf });
    }
  }
  const cntdwn = ({ hours, minutes, seconds, completed }: props) => {
    if (completed) {
      // Render a completed state
      return (
        <>
          <h1 className='flex justify-center text-[#161B40]'>ticket sale as now closed</h1>
        </>
      );
    } else {
      // Render a countdown
      return (
        <>
          <div className='flex mx-2 text-center'>
            <div className='flex-1 mx-1'>
              <div className='border-2 border-black'>
                <h1 className='p-4 text-red-600'>{hours}</h1>
              </div>
              <h1>hours</h1>
            </div>
            <div className='flex-1 mx-1'>
              <div className='border-2 border-black'>
                <h1 className='p-4 text-red-600'>{minutes}</h1>
              </div>
              <h1>minutes</h1>
            </div>
            <div className='flex-1 mx-1'>
              <div className='border-2 border-black'>
                <h1 className='p-4 text-red-600'>{seconds}</h1>
              </div>
              <h1>seconds</h1>
            </div>

          </div>
        </>
      )
    }

  }


  useEffect(() => {
    if (!gettickets) {
      return;
    }
    const totalticket: string[] = gettickets;
    const no_of_user_ticket = totalticket.reduce((total, tckadds) => (
      tckadds === address ? total + 1 : total
    ), 0);
    setUser_tck(no_of_user_ticket);
  }, [gettickets, address]);

  if (isLoading) {
    return (
      <>
        <div className="flex flex-col justify-center items-center min-h-screen">
          <h1 className="flex justify-center items-center text-white">loading the page wait...</h1>
          <div className="flex justify-center items-center mt-2">
            <BarLoader color="#0bee14" />
          </div>
        </div>
      </>
    )
  }
  return (
    <>
      {address && (
        <>
          {/* <button onClick={ondrawwinnerticket}>test</button> */}
          <div className='flex justify-end sm:justify-center my-2'>
            <button className="mx-2 py-2 px-4 text-white bg-black rounded">BuyTicket</button>
            <button className="mx-2 py-2 px-4 text-white bg-gray-600 rounded" onClick={disconnect}>Logout</button>
          </div>
        </>
      )}

      <div className="flex min-h-screen flex-col justify-center py-2 sm:items-center">
        <Head>
          <title>Next Lottery App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div>
          {address ? (
            <>

              {/* marquee */}
              <Marquee speed={100} gradientColor={[1, 1, 1]} pauseOnHover={true} className="text-white font-bold m-2">
                <p>last winner {lastWinner?.toString()}&nbsp;</p>
                <p>last winner amount {lastWinnerAmount && ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "}{currency}</p>
              </Marquee>

              {/* admin control  */}
              {address === process.env.NEXT_PUBLIC_ADMINCONTROL_ADDRESS && (
                <>
                  <AdminControl ondrawwinnerticket={ondrawwinnerticket} onwithdrawcommission={onwithdrawcommission} onrestartdraw={onrestartdraw} onrefundall={onrefundall} />
                </>
              )}

              {/* Connected */}
              <h4 className='flex justify-center m-2'>
                <span className='text-white'>Connected as {" "}</span>
                <span className='text-[#43BEE5] font-bold'>&ensp;{address.substring(0, 5)}....{address.substring(address.length - 5, address.length)}</span>
              </h4>

              {/* winner */}
              {winner > 0 && (
                <>
                  <div className="flex flex-1 justify-center text-white font-bold items-center m-2">
                    <p>Total Winning {ethers.utils.formatEther(winner.toString())}{" "}{currency}</p>
                    <button className="p-1 bg-black text-white rounded ml-2" onClick={onwithdrawWinnings}>&ensp;click here</button>
                  </div>
                </>
              )}

              <div className="flex flex-col sm:flex-row text-[green] font-bold justify-center">
                {/* left box  */}
                <div className="bg-[#43BEE5] border-2 rounded-lg border-black m-1">
                  <h1 className="flex justify-center text-[#161B40] font-mono font-bold">Next Lucky Draw</h1>
                  <div className="flex p-2 sm:w-96">
                    <div className="flex-1 border-2 border-black rounded-2 mx-1 px-1 font-serif">
                      <h1>total price</h1>
                      <h1>{currentWinningReward && ethers.utils.formatEther(currentWinningReward.toString())} {currency}</h1>
                    </div>
                    <div className="flex-1 border-2 border-black rounded-2 mx-1 px-1 font-serif">
                      <h1>ticket remaining</h1>
                      <h1>{remainingtickets?.toNumber()}</h1>
                    </div>
                  </div>
                  {/* countdown */}
                  <Countdown date={new Date(expiration * 1000)} renderer={cntdwn} />
                  {/* countdown */}
                </div>

                {/* right box  */}
                <div className="bg-[#43BEE5] border-2 rounded-lg border-black m-1">
                  {/* <h1 className="flex justify-center text-white">left box</h1> */}
                  <div className="border-2 rounded-lg border-black m-2">
                    <div className="flex items-center mx-1 justify-between font-serif">
                      <h1>price per ticket</h1>
                      <h1>0.01matic</h1>
                    </div>

                    <div className="border-2 rounded-lg border-black m-1 font-serif">
                      <input type="number" min={1} max={10} step={1} value={quantity} onChange={(e) => {
                        setQuantity(Number(e.target.value))
                      }} />
                    </div>
                    <div className="flex items-center mx-1 justify-between font-serif">
                      <h1>total cost of ticket</h1>
                      <h1>{ticketprice && ethers.utils.formatEther(Number(ticketprice * quantity).toString())} {currency}</h1>
                    </div>
                    <div className="flex items-center mx-1 justify-between font-serif">
                      <h1>service fee</h1>
                      <h1>{ticketcommission && ethers.utils.formatEther(ticketcommission.toString())} {currency}</h1>
                    </div>
                    <div className="flex items-center mx-1 justify-between font-serif">
                      <h1>Amount fee</h1>
                      <h1>0.01matic</h1>
                    </div>
                    <div className="flex justify-center items-center m-2">
                      <button className="bg-[#F40058] text-white p-2 disabled:cursor-not-allowed rounded" disabled={expiration?.toString() < Date.now().toString() || remainingtickets?.toString() === "0"} onClick={buytkt}>
                        buy {quantity} ticket for {ticketprice && ethers.utils.formatEther(Number(ticketprice * quantity).toString())} {currency}
                      </button>
                    </div>
                    {user_tck > 0 && (
                      <>
                        <div className="bg-[#43BEE5] border-2 rounded-lg border-black m-1">
                          <p>you have {user_tck} Tickets in this Draw</p>
                          <div className='flex flex-wrap gap-2'>
                            {Array(user_tck).fill("").map((_, index) => (
                              <p key={index} className="bg-yellow-500 text-white h-10 w-10 text-center rounded-lg justify-center items-center">{index + 1}</p>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className='mb-2'>
                <h1 className='text-white'>Login please with <span className='font-bold text-[#43BEE5]'>metamask</span> </h1>
                <button className="bg-black text-white p-1 mt-2 rounded" onClick={connectWithMetamask}>
                  Connect Metamask Wallet
                </button>
              </div>
            </>
          )}
        </div>
        {/* {address && <button className="bg-black text-white p-1 mt-2 rounded" onClick={disconnect}>logout</button>} */}

        <footer className="flex h-24 w-full items-center justify-center border-t">
          <a
            className="flex items-center justify-center gap-2"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className='text-white'>Powered by{' '}</span>
            {/* <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} /> */}
            <h1 className='text-[yellow]'>@Asu Salman</h1>
          </a>
        </footer>
      </div>
    </>
  )
}

export default Home
