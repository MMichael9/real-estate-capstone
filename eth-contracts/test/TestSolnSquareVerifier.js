var verifier = artifacts.require("./Verifier");
var solnSquareVerifier = artifacts.require('SolnSquareVerifier')
var proof = require('../../zokrates/code/square/proof.json');

contract('TestSolnSquareVerifier' , accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('Test integration in SolnSquareVerifier contract', function() {

        beforeEach(async function () {
            this.verifierContract = await verifier.new({from: account_one});
            this.solnSquareVerifierContract = await solnSquareVerifier.new(this.verifierContract.address, {from: account_one});
        });

        it('Test if a new solution can be added for contract - SolnSquareVerifier', async function () {

            // Declare and Initialize a variable for event
            var eventEmitted = false;
            
            // Watch the emitted event Received()
            await this.solnSquareVerifierContract.SolutionAdded(null, (error, event)=>{
                eventEmitted = true;
            });

            let bytes32Num = "0x05416460deb76d57af601be17e777b93592d8d4d4a4096c57876a91c84f4a712"

            let res = await this.solnSquareVerifierContract.addSolution(0, account_two, bytes32Num, {from: account_one});

            assert.equal(eventEmitted, true, "Event has not been emitted");
            assert.equal(res.logs[0].event, 'SolutionAdded', "Event has not been emitted");
        });

        it('Test if an ERC721 token can be minted for contract - SolnSquareVerifier', async function () {

            let token = await this.solnSquareVerifierContract.mint( proof.proof.a, proof.proof.b, proof.proof.c,
                proof.inputs, 1 , { from: account_one });

            let owner = await this.solnSquareVerifierContract.ownerOf(1);

            assert.equal(owner, account_one, "Token owner incorrect or token is not minted!");
        })
    });
})