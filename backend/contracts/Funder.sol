// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/**
 * @author  Anubhav Singh
 * @title   Funder - A smart contract for creating fundraising campaigns and receiving donations.
 * @dev     This contract allows users to create fundraising campaigns.
 * @notice  This contract is for educational and illustrative purposes only. Use at your own risk.
 */

contract Funder {
    address public owner;
    uint256 private numberOfFundme = 0;

    struct Fundme {
        address owner;
        string name;
        string username;
        string description;
        string email;
        string imageURL;
        uint256 amount;
        bool isRunning;
        uint256 balance;
        uint256 deadline;
    }
    Fundme[] private fundme;

    // Events
    event FundMeCreated(address, string, string);
    event FundMeDeleted(address, string, string);
    event DonationSent(address, string, uint256);
    event BalanceClaimed(address, string, uint256);

    constructor() {
        owner = msg.sender;
    }

    // Functions
    /**
     * @dev Creates a new fundraising campaign.
     * @param _name The name of the campaign.
     * @param _username The username associated with the campaign.
     * @param _description The description of the campaign.
     * @param _email The email associated with the campaign.
     * @param _imageURL The URL of the campaign's image.
     * @param _amount The fundraising target amount.
     * @param _durationDays The fundraising deadling.
     */
    function registerFundraiser(
        string calldata _name,
        string calldata _username,
        string calldata _description,
        string calldata _email,
        string calldata _imageURL,
        uint256 _amount,
        uint256 _durationDays
    ) public {
        for (uint i = 0; i < numberOfFundme; i++) {
            require(
                fundme[i].owner != msg.sender,
                "You can only create Fundraiser once though each address."
            );
        }
        numberOfFundme += 1;
        uint256 deadline = block.timestamp + (_durationDays * 1 days);
        Fundme memory newFundme = Fundme(
            msg.sender,
            _name,
            _username,
            _description,
            _email,
            _imageURL,
            _amount,
            true,
            0,
            deadline
        );
        fundme.push(newFundme);
        emit FundMeCreated(msg.sender, _name, _description);
    }

    /**
     * @dev Sends a donation to a specific fundraising campaign.
     * @param _owner The address of the campaign owner.
     */
    function donateToFundme(address _owner) public payable {
        require(msg.value > 0, "You need to send some ethers");
        bool donated = false;
        for (uint256 i = 0; i < numberOfFundme; i++) {
            if (fundme[i].owner == _owner) {
                require(
                    fundme[i].balance < fundme[i].amount,
                    "Target already reached"
                );
                require(fundme[i].isRunning, "Fundraising has stopped");
                require(
                    fundme[i].deadline >= block.timestamp,
                    "Deadline has Passed"
                );
                fundme[i].balance += msg.value;
                emit DonationSent(_owner, fundme[i].name, msg.value);
                donated = true;
                break;
            }
        }
        require(donated, "Cannot Donate to this Fundme");
    }

    /**
     * @dev Claims the balance accumulated in the caller's campaign if the target is reached.
     */
    function claimBalance() public {
        address payable _owner = payable(msg.sender);
        for (uint256 i = 0; i < numberOfFundme; i++) {
            if (fundme[i].owner == _owner) {
                require(fundme[i].isRunning, "Fundraising has stopped");
                require(
                    (fundme[i].balance >= fundme[i].amount) ||
                        (fundme[i].deadline <= block.timestamp),
                    "Target not reached yet or deadline hasn't passed"
                );
                (bool success, ) = _owner.call{value: fundme[i].balance}("");
                require(success, "Can't claim Balance");
                emit BalanceClaimed(_owner, fundme[i].name, fundme[i].balance);
                fundme[i].balance = 0;
                fundme[i].isRunning = false;
                break;
            }
        }
    }

    /**
     * @dev Retrieves the information of a specific fundraising campaign.
     * @param _owner The address of the campaign owner.
     */
    function getFunder(
        address _owner
    )
        public
        view
        returns (
            address fundmeOwner,
            string memory name,
            string memory username,
            string memory description,
            string memory email,
            string memory imageURL,
            uint256 amount,
            bool isRunning,
            uint256 balance,
            uint256 deadline
        )
    {
        for (uint i = 0; i < numberOfFundme; i++) {
            if (fundme[i].owner == _owner) {
                return (
                    fundme[i].owner,
                    fundme[i].name,
                    fundme[i].username,
                    fundme[i].description,
                    fundme[i].email,
                    fundme[i].imageURL,
                    fundme[i].amount,
                    fundme[i].isRunning,
                    fundme[i].balance,
                    fundme[i].deadline
                );
            }
        }
    }

    /**
     * @dev Retrieves all the active fundraising campaigns.
     */
    function getAllFunders() public view returns (Fundme[] memory) {
        return fundme;
    }

    receive() external payable {}
}
