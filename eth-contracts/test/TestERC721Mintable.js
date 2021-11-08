var ERC721MintableComplete = artifacts.require("./CustomERC721Token");

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    console.log(account_one);
    console.log(account_two);
    console.log(account_three);

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_two, 1, "1", {from: account_one});
            await this.contract.mint(account_two, 2, "2", {from: account_one});
            await this.contract.mint(account_two, 3, "3", {from: account_one});
            await this.contract.mint(account_three, 4, "4", {from: account_one});

        })

        it('should return total supply', async function () { 
            
            const expected = 4
            const actual = await this.contract.totalSupply.call();

            assert.equal(actual.toNumber(), expected, "There should be 4 tokens minted at this stage");
        })

        it('should get token balance', async function () { 
            
            const expected = 3;
            const actual = await this.contract.balanceOf.call(account_two);

            assert.equal(actual.toNumber(), expected, "This account should have 3 tokens");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            
            let expected = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1";
            const actual = await this.contract.tokenURI.call(1);
            
            assert(actual == expected, "token url is not the same");
        })

        it('should transfer token from one owner to another', async function () { 

            const tokenId = 1;
            const owner = account_two;

            await this.contract.transferFrom(account_two, account_three, tokenId, {from: account_two});

            const newOwner = await this.contract.ownerOf(tokenId);

            assert.equal(newOwner, account_three, "new owner of the token should be account three");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 

            let fail = false;

            try
            {
                await this.contract.mint(account_three, 5, "5", {from: account_two});
            }
            catch(e)
            {
                fail = true;
            }
            
            assert.equal(fail, true, "contract should not allow mint. only owner can mint");
        })

        it('should return contract owner', async function () { 

            let owner = await this.contract.owner.call({from: account_one});
            assert.equal(owner, account_one, "contract owner is account one");
        })

    });
})