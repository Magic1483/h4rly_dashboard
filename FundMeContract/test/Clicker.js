const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Clicker contract", function () {
    let Clicker;
    let clicker;
    let owner;
    let addr1;
    let addr2;


    beforeEach(async function () {
        Clicker = await ethers.getContractFactory('Clicker');
        [owner,addr1,addr2] = await ethers.getSigners(); //get test wallets
        clicker = await Clicker.deploy() //deploy contract
    })


    it("Should initialize with zero clicks", async function () {
        expect(await clicker.total_clicks()).to.equal(0);
    });

    it("should increment total_clicks when someone clicks ",async function () {
        await clicker.click();
        expect(await clicker.total_clicks()).to.equal(1);

        await clicker.click();
        expect(await clicker.total_clicks()).to.equal(2);
    });

    it("should track click per user :-) ",async function () {
        await clicker.connect(addr1).click()
        await clicker.connect(addr1).click()
        expect(await clicker.getUserClicks(addr1.address)).to.equal(2);

        await clicker.connect(addr2).click()
        expect(await clicker.getUserClicks(addr2.address)).to.equal(1);

    });

    it("should emit Click event on each click (⌐■_■) ",async function () {
        await expect(clicker.click())
            .to.emit(clicker,"Click")
            .withArgs(owner.address,1)

        await expect(clicker.connect(addr1).click())
            .to.emit(clicker,"Click")
            .withArgs(addr1.address,1)

    });

  });