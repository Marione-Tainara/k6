import http from 'k6/http';
import { check } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export function handleSummary(data) {
    return {
        'report.html': htmlReport(data),
    };
}

export const options = {
    stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '5m', target: 200 },
        { duration: '2m', target: 300 },
        { duration: '5m', target: 300 },
        { duration: '2m', target: 400 },
        { duration: '5m', target: 400 },
        { duration: '10m', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'],
        http_req_failed: ['rate<0.01'],
    },
};

export default function () {
    const url = 'http://localhost:3333/signup';
    const email = Math.random().toString(24).substring(7) + '@example.com';

    const payload = JSON.stringify({
        email: email,
        password: '123456',
    });
    const headers = {
        headers: { 'Content-Type': 'application/json' },
    };

    const response = http.post(url, payload, headers);

    check(response, {
        'Status is 201': (r) => r.status === 201,
    });
}
