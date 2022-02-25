const {expect} = require("chai");
const {ethers} = require('hardhat');
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace");

describe("EtherFond", function(){

    let EtherFond;
    let hardhatEtherFond;
    let owner;
    let acc1;
    let acc2;
    let addrLast;
    let hdhatAccounts;



    beforeEach( async function(){

        EtherFond = await ethers.getContractFactory("EtherFond");
        hdhatAccounts = await ethers.getSigners();

        [owner, acc1, acc2, ...accLast] = hdhatAccounts;

        hardhatEtherFond = await EtherFond.deploy();
        await hardhatEtherFond.deployed();
    });




    describe("***Deployment", function(){

        it( "Should set the right owner", async function () {

            expect(await hardhatEtherFond.owner()).to.equal(owner.address);
          
        });

    });

    describe("***Transfer",  function(){

        it( "Should transfer tokens between accounts", async function () {

            const initOwnerBalance = await hardhatEtherFond.balansOf(owner.address);
           
            await hardhatEtherFond.transfer(acc1.address, 100);

            const finalOwnerBalance = await hardhatEtherFond.balansOf(owner.address);
            const finalacc1Balance = await hardhatEtherFond.balansOf(acc1.address);            
         

            expect(finalacc1Balance).to.equal(100);
            expect(initOwnerBalance-finalOwnerBalance).to.equal(100);
           
        });

        it( "Should be fail if sender not enough token!", async function () {

            const initOwnerBalance = await hardhatEtherFond.balansOf(owner.address);            

            await expect(
                hardhatEtherFond.transfer(acc1.address, initOwnerBalance+5000)
              ).to.be.revertedWith("Not enough token!");              
              
            // Owner balance shouldn't have changed.            
            expect(await hardhatEtherFond.balansOf(owner.address)).to.equal(initOwnerBalance);
        });



    });
    


    describe("***Donate",  function(){

        it( "Should donate tokens to Owner", async function () {

            await hardhatEtherFond.transfer(acc2.address, 100);
            
            const initOwnerBalance = await hardhatEtherFond.balansOf(owner.address);              
            const initacc1Balance = await hardhatEtherFond.balansOf(acc2.address);            

            await hardhatEtherFond.connect(acc2).donate(50);

            const finalOwnerBalance = await hardhatEtherFond.balansOf(owner.address);              
            const finalacc1Balance = await hardhatEtherFond.balansOf(acc2.address); 

            expect(initOwnerBalance).to.equal(finalOwnerBalance.sub(50));
            expect( finalacc1Balance).to.equal(initacc1Balance.sub(50));           
           
        });

        it( "Amount should be greater than 0", async function () {

            await hardhatEtherFond.transfer(acc2.address, 100);
            await expect(  hardhatEtherFond.connect(acc2).donate(-50) ).to.be.reverted;
           
        });

        it( "Account shouldn't be blocked", async function () {

            hardhatEtherFond.addToBlockList(acc1.address);
            await expect(  hardhatEtherFond.connect(acc1).donate( 100))
            .to.be.revertedWith("Donation is blocked by your address");
           
        });

        it( "Account's balance must be >= donate amount", async function () {

            hardhatEtherFond.transfer(acc1.address, 100);
            await expect(  hardhatEtherFond.connect(acc1).donate( 200))
            .to.be.revertedWith("Not enough token!");
           
        });

    });

    describe( "***AddToBlockList", function(){

        it("Given address should not be blocked by another account", async function ( ) {
            await expect( hardhatEtherFond.connect(acc1).addToBlockList(acc2.address) )
            .to.be.revertedWith("Ownable: caller is not the owner");            

        } )

        it("Given address must be blocked  by owner", async function ( ) {

            await hardhatEtherFond.addToBlockList(acc1.address);
            expect( await hardhatEtherFond.isDonationBlocked(acc1.address)).to.equal(true);

        } )


    });

    describe("***removeFromBlockList", function(){

        it("unlocking shouldn't be done by another account ", async  function() {

            await hardhatEtherFond.addToBlockList(acc1.address);
            await expect( hardhatEtherFond.connect(acc2).removeFromBlockList(acc1.address) )
            .to.be.revertedWith( "Ownable: caller is not the owner");
        } );

        it("unlocking should be done only by owner ", async  function() {

            await hardhatEtherFond.addToBlockList(acc1.address);
            await hardhatEtherFond.removeFromBlockList(acc1.address) ;
            
            expect( await hardhatEtherFond.isBlocked(acc1.address) ).to.be.equal(false)
        } );       

    });

    describe("***withdrawEther", function(){

        it("withdrawEther should be done only by owner ", async  function() {

            await hardhatEtherFond.transfer(acc1.address, 100);
            await expect( hardhatEtherFond.connect(acc1).withdrawEther() )
            .to.be.revertedWith( "Ownable: caller is not the owner");
        } );

            

    })

    






   

});
