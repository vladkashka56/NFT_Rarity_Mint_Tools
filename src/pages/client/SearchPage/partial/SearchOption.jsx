import React, { useContext, useEffect, useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';
import InputField from '../../../../components/InputField';
import Selectbox from '../../../../components/Selectbox';
// import Button from '../../../../components/Button/Button';
import { EtherContext } from '../../Context';
import { ReactComponent as InfoCircleIcon } from '../../../../assets/icons/icon-info-circle.svg';
import { Popconfirm, message, Button } from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEthers } from '@usedapp/core';
import { ethers } from 'ethers';

import { useDispatch, useSelector } from 'react-redux';
import { updateScrappingProgress } from './updateScrappingProgress';
import { updateDataFreshnessTs } from './updateFreshness';
import { updateNftLimitReached } from './updateNftLimit';
import { updateForceFlag } from './updateForceFlag';

const sortOptions = ['Rank-High to Low', 'Rank-Low to High'];
const defaultSortOption = 'Rank-High to Low';

const showOptions = ['5', '10', '30'];
const defaultShowOption = '10';

const SearchOption = () => {
  const dispatch = useDispatch();
  const {
    sortByOrder,
    loggedIn,
    setLoggedIn,
    setShowRanking,
    tokenId,
    page,
    totalCount,
    pageOptions,
    nftContractAddress,
    showRanking,
    setTokenId,
    setSortByOrder,
    setShowPerPage,
    setPageOptions,
    setPage,
  } = useContext(EtherContext);

  const scrappingProgress = useSelector(updateScrappingProgress);
  const nftLimitReached = useSelector(updateNftLimitReached);
  const dataFreshnessTs = useSelector(updateDataFreshnessTs);
  const { account, activateBrowserWallet } = useEthers();
  const [contractAddress, setContractAddress] = useState('');

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({ placement: 'top' });

  useEffect(() => {
    setContractAddress(nftContractAddress);
  }, [showRanking]);

  const handleTokenChange = (e) => {
    setTokenId(e.target.value);
  };

  const handleSortByOrder = (option) => {
    setSortByOrder(option.value);
  };

  const handleShowPerPage = (option) => {
    setShowPerPage(option.value);
    setPageOptions(
      Array.from(
        { length: Math.ceil(totalCount / parseInt(option.value)) },
        (_, i) => (i + 1).toString()
      )
    );
    setPage('1');
  };

  const handlePage = (option) => {
    setPage(option.value);
  };

  const confirm = async () => {
    dispatch(updateForceFlag(true))
    if (nftContractAddress) {
      // await activateBrowserWallet();

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
        params: [
          {
            eth_accounts: {},
          },
        ],
      });

      sessionStorage.clear();
      try {
        account &&
          window.location.pathname.indexOf('search') >= 0 &&
          (await axios
            .get(`https://api.xflipper.io/user/${accounts[0]}`)
            .then(async (response) => {
              const { message, signature } = await getSignature({
                message: response.data.nonce,
              });

              console.log("SORTBYORDER", sortByOrder);
              // Set the auth-token on sessionStorage
              sessionStorage.setItem('signature', signature);
              setLoggedIn(true);
              setShowRanking(true);
            })
            .catch((error) => {
              setLoggedIn(false);

              if (error.response) {
                console.log('Error', error.response.status);
                toast.error('API not found', {
                  appearance: 'error',
                });
              }
            }));
      } catch (e) {
        setLoggedIn(false);

        if (e.code === 401) {
          toast.warning('User rejected request', {
            appearance: 'warning',
          });
        }
        console.log(e);
      }
    }
  }
  
  function cancel(e) {
    console.log(e);
    // message.error('Click on No');
  }

  // Get the signature using ether.js
  const getSignature = async ({ message }) => {
    try {
      if (!window.ethereum)
        throw new Error('No crypto wallet found. Please install it.');

      await window.ethereum.send('eth_requestAccounts');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(message);

      return {
        message,
        signature,
      };
    } catch (err) {
      // setLoading(false);

      toast.error(err.message, {
        appearance: 'error',
      });
    }
  };

  function convertToTimestamp (dateTimeString) {
    let dateTimeParts = dateTimeString.split('.')[0].split('T')
    let timeParts = dateTimeParts[1].split(':')
    let dateParts = dateTimeParts[0].split('-')
    return new Date(dateParts[0], parseInt(dateParts[1], 10) - 1, dateParts[2], timeParts[0], timeParts[1], timeParts[2]);
  }

  const handleContractAddrChange = (e) => {};
  return (
    <div className='search-option-panel'>
      <div className='search-option-item'>
        <div className='token'>
          <div className='title'>Token</div>
          <InputField
            type='text'
            name='tokenId'
            value={tokenId}
            disabled={!loggedIn}
            placeholder={'ID'}
            handleChange={handleTokenChange}
          />
        </div>
        <div className='sort-by'>
          <div className='title'>Sort By</div>
          <Selectbox
            options={sortOptions}
            value={defaultSortOption}
            disabled={!loggedIn}
            handleChange={handleSortByOrder}
          />
        </div>
        {/* <div className='show-per-page'>
          <div className='title'>Show per page</div>
          <Selectbox
            options={showOptions}
            value={defaultShowOption}
            disabled={!loggedIn}
            handleChange={handleShowPerPage}
          />
        </div> */}
        <div className='page'>
          <div className='title'>Page</div>
          <div className='grid-column-2'>
            <Selectbox
              options={pageOptions}
              value={page}
              disabled={!loggedIn}
              handleChange={handlePage}
            />
            <div className='title'>of {pageOptions.length}</div>
          </div>
        </div>
        <div className='refresh'>
          {loggedIn ? 
            <Popconfirm
              title={<div><span>Are you sure you want to proceed with rescrapping this collection?</span> <br />
                <span>You will still have access to current data.</span></div>}
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button
                className='btn-dark'
                // title='Refresh Traits'
                disabled={false}
              >{(scrappingProgress.payload.scrappingProgress.value >= 0 && scrappingProgress.payload.forceFlag.value == true) ? `Refreshing ${scrappingProgress.payload.scrappingProgress.value}%` : `Refresh Traits`}</Button>
            </Popconfirm> :
            <Button
              className='btn-dark'
              // title='Refresh Traits'
              disabled={true}
            >Refresh Traits</Button>
          }

          <div className='info-icon' ref={setTriggerRef}>
            <InfoCircleIcon />
          </div>

          {visible && totalCount > 0 && (
            <div
              ref={setTooltipRef}
              {...getTooltipProps({ className: 'tooltip-container' })}
            >
              <span style={{fontSize: "10pt"}}>Last Data Refresh: {new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(convertToTimestamp(dataFreshnessTs.payload.dataFreshnessTs.value).getTime())}</span>
              <span style={{fontSize: "10pt"}}>This will initiate static data refresh, which includes images and traits, it's usefull when NFTs are manually revealed.</span>
              <span style={{fontSize: "10pt"}}>*You will still have access to current data.</span>
              <div {...getArrowProps({ className: 'tooltip-arrow' })} />
            </div>
          )}
        </div>
        <div className='contract-address'>
          <div className='title'>Contract Address</div>
          <InputField
            type='text'
            name='contractAddress'
            value={contractAddress}
            handleChange={handleContractAddrChange}
          />
        </div>
      </div>
      {nftLimitReached.payload.nftLimitReached.value && <p style={{color: "red", marginTop: "10px"}}>
        Due to Limitations of Etherscan and OpenSea APIs we scrapped only 10k NFTs. Be accurate about this collection as not all the info is acquired and rarity calculation may not be accurate
      </p>}
    </div>
  );
};

export default SearchOption;
