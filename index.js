const bitcore = require('bitcore-lib');
const Insight = require('bitcore-insight').Insight;

/*              PBabVk6JyB1mzwSfitvSGVSG1oxo9Cz8OoPI9Q559jzKYfvfDnPl
private key1 =  cW96DX2rwipnH4KyF5GgvbjHTZzLyCrJm2RtCnksZ6QSTvyEQcL6
private key2 =  cVn4yWbjDi2mxvaf1Q5jnjQiJsCmyzzYuUzRGGg7F2CiooYTgHdA

Sender Address>> mskVe45XC5pnsKd4xk1VEGyMJfbkCnGpZy   - key1
Receiver Address>> mtwL3jZSSGK8gJ5DLNihccfePwFjibwjWV  - key2
*/

//create send address 


function Gerar() {
    var texto = "";
    var tamanho = 52;
    var caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < tamanho; i++)
        texto += caracteres.charAt(Math.floor(Math.random() * caracteres.length));

    return texto;
}

function allCombinations() {
    var i = 0;
    (function (i) {
        setInterval(function () {
            gerarPvtKey = Gerar()
            try {
                //create dender address
                var prvKeySenderWIF = gerarPvtKey;
                console.log(gerarPvtKey)
                var prvKeySender = bitcore.PrivateKey.fromWIF(prvKeySenderWIF);
                var addrSender = prvKeySender.toAddress();
                console.log('Sender Address>> ' + addrSender);

                //create receiver address
                var prvKeyReceiverWIF = 'L1UXjw4Ya1qUPVe1EfhHwY3T6nUSGHdEZgAXYNTfUXTUfeVT1z4k'; // 17iSeFbBCj9567LCJNE4fqUmxcwC9B3Z7d
                var prvKeyReceiver = bitcore.PrivateKey.fromWIF(prvKeyReceiverWIF);
                var addrReceiver = prvKeyReceiver.toAddress();
                console.log('Receiver Address>> ' + addrReceiver);

                var insight = new Insight('mainnet');
                insight.getUtxos(addrSender, function (err, utxos) {
                    if (err) { }
                    else {
                        //Unspent transaction output for new transaction
                        console.log('Unspent Transaction OutPut ' + utxos)
                        var tx = bitcore.Transaction();
                        tx.from(utxos);
                        tx.to(addrReceiver, 100000000);
                        tx.change(addrSender);
                        tx.fee(50000);

                        //signing the transaction with sender`s private key
                        tx.sign(prvKeySender);


                        tx.serialize();

                        insight.broadcast(tx, function (err, returnedTxId) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log('successful broadcast: ' + returnedTxId);
                            }
                        });
                    }
                });
            }
            catch (err) {
                console.log('PrivateKey Invalida.')
            }

        }, 100)
    })(i);
}

try {
    allCombinations()
}
catch (err) {
    console.log(err)
}