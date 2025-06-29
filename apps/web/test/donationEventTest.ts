// Simple test to verify donation event functionality
import { testDonationEvent, testRegularEvent } from './eventTestData';

console.log('Testing donation event detection:');
console.log('Donation event metadata:', testDonationEvent.metadata);
console.log('Is donation event:', testDonationEvent.metadata?.name === 'donation');

console.log('\nTesting regular event:');
console.log('Regular event metadata:', testRegularEvent.metadata);
console.log('Is donation event:', testRegularEvent.metadata?.name === 'donation');

console.log('\nTesting login requirements:');
console.log('Donation event requires login:', testDonationEvent.allowLogin && !testDonationEvent.allowGuest);
console.log('Regular event allows guest:', testRegularEvent.allowGuest);

export {};