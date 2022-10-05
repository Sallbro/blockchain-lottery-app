type Props = {
    ondrawwinnerticket: () => void,
    onwithdrawcommission: () => void,
    onrestartdraw: () => void,
    onrefundall: () => void

}
function AdminControl({ ondrawwinnerticket, onwithdrawcommission, onrestartdraw, onrefundall }: Props) {
    return (
        <>
            <h1 className="flex justify-center text-white">Admin Pannel</h1>
            <div className="flex flex-wrap justify-center">
                <button className="bg-black text-white font-sans p-2 m-2 hover:bg-gray-500 rounded" onClick={ondrawwinnerticket} >Draw Winner</button>
                <button className="bg-black text-white font-sans p-2 m-2 hover:bg-gray-500 rounded" onClick={onwithdrawcommission}>WithDraw Commission</button>
                <button className="bg-black text-white font-sans p-2 m-2 hover:bg-gray-500 rounded" onClick={onrestartdraw}>Restart Draw</button>
                <button className="bg-black text-white font-sans p-2 m-2 hover:bg-gray-500 rounded" onClick={onrefundall}>Refund All</button>
            </div>
        </>
    );
}
export default AdminControl;