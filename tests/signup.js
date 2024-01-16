import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 30,
    duration: '30s',
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
