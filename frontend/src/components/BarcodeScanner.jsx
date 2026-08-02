import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function BarcodeScanner({ onScan }) {

    useEffect(() => {

        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: {
                    width: 250,
                    height: 250
                }
            },
            false
        );

        scanner.render(

            (decodedText) => {

    console.log("Scanned:", decodedText);
    alert("Scanned: " + decodedText);

    onScan(decodedText);

    scanner.clear().catch(() => {});

},

            () => {
                // Ignore scan errors
            }

        );

        return () => {

            scanner.clear().catch(() => {});

        };

    }, [onScan]);

    return (

        <div className="card mt-3">

            <div className="card-header">

                Scan Barcode / QR Code

            </div>

            <div className="card-body">

                <div id="reader"></div>

            </div>

        </div>

    );

}

export default BarcodeScanner;