import './App.css';
import { useEffect, useState } from "react";

const { REACT_APP_EXCHANGE_API_URL } = process.env;

function App() {
    const [didRender, setDidRender] = useState(false);
    const [error, setError] = useState(null);
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState("EUR");
    const [amountToPay, setAmountToPay] = useState();
    const [surcharge, setSurcharge] = useState();
    const [discount, setDiscount] = useState();
    const [totalAmount, setTotalAmount] = useState();
    const [successPurchase, setSuccessPurchase] = useState(false);

    useEffect(() => {
        setDidRender(true);
    }, []);


    useEffect(() => {
        if (didRender) {
            setError(null);
            setSuccessPurchase(null);
            fetch(
                `${REACT_APP_EXCHANGE_API_URL}/v1/convert?from=${fromCurrency}&amount=${amount}`
            ).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            }).then(response => {
                const amountToPay = response.amount;
                setAmountToPay(amountToPay);
                const surcharge = response.surcharge ?  response.surcharge + '%' : null;
                setSurcharge(surcharge);
                const discount = response.discount ?  response.discount + '%' : null;
                setDiscount(discount);
                const totalAmount = response.totalAmount;
                setTotalAmount(totalAmount);
            }).catch(error => setError(error));
        }
    }, [amount, fromCurrency])

    const purchase = async () => {
        setError(null);
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({from: fromCurrency, amount: amount, totalAmount: totalAmount})
        };
        await fetch(`${REACT_APP_EXCHANGE_API_URL}/v1/orders`, requestOptions
        ).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Something went wrong ...');
            }
        }).then(response => {
            setSuccessPurchase(true);
        }).catch(error => setError(error));
    };

    return (
        <div className="container">
            <div className="input-from">
                <label>Currency:</label>
                <select
                    id="from"
                    value={fromCurrency}
                    onChange={(e) =>
                        setFromCurrency(e.target.value)
                    }
                >
                    <option value="EUR">Euro</option>
                    <option value="GBP">British Pound</option>
                    <option value="JPY">Japanese Yen</option>
                </select>
            </div>

            <div className="input-amount">
                <label>Amount:</label>
                <input
                    type="number"
                    id="amount"
                    onChange={(e) =>
                        setAmount(e.target.value)
                    }
                    value={amount}
                    min="1"
                />
            </div>

            <div className="output">
                {error ? <p>An error occurred: {error.message}</p> : (
                    <>
                        {amountToPay && <label>Amount to pay: {amountToPay}</label>}
                        {surcharge && <label>Surcharge: {surcharge}</label>}
                        {discount && <label>Discount: {discount}</label>}
                        {totalAmount && <label>Total amount: {totalAmount}</label>}
                        {totalAmount && <button className="btn" onClick={() => purchase()}>Purchase</button>}
                        {successPurchase && <p><b>Success purchase!</b></p>}
                    </>
                )
                }
            </div>
        </div>
    );
}

export default App;

