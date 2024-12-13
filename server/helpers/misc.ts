import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';
import { isUUID } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export class Misc {
  static titleText(text: string): string {
    return text
      .trim()
      .split(' ')
      .map((txt) => txt[0].toUpperCase() + txt.slice(1).toLowerCase())
      .join(' ');
  }

  static toLowerCase(text: string) {
    return text.toLowerCase().trim();
  }

  static toUpperCase(text: string) {
    return text.toUpperCase().trim();
  }

  static formatEmail(email: string) {
    const lowerCaseEmail = this.toLowerCase(email);
    const [localPart, domainPart] = lowerCaseEmail.split('@');

    const cleanedLocalPart = localPart.replace(/\./g, '');

    return `${cleanedLocalPart}@${domainPart}`;
  }

  static generateOtp(length: number = 4): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join(
      '',
    );
  }

  static getFullName(firstName: string, lastName: string, middleName?: string) {
    return `${firstName} ${lastName} ${middleName}`
      .split(' ')
      .filter(Boolean)
      .filter((name) => name !== 'undefined')
      .join(' ');
  }

  static sanitizeData<T>(data: T, skipFieldNames: Array<keyof T>) {
    const removeFields = (obj: any) => {
      for (const key of skipFieldNames) {
        if (key in obj) {
          delete obj[key];
        }
      }

      for (const key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
          removeFields(obj[key]);
        }
      }
    };

    removeFields(data);
  }

  static paginateHelper(size: number, currentPage: number, limit: number) {
    const totalPages = Math.ceil(size / limit);
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;

    return {
      size,
      hasNext,
      hasPrev,
      totalPages,
      currentPage,
      offset: (currentPage - 1) * limit,
      totalItems: limit > size ? size : limit,
      nextPage: hasNext ? currentPage + 1 : null,
      previousPage: hasPrev ? currentPage - 1 : null,
    };
  }

  static formatIP(ip: string) {
    const localIPs = [':1', '::1', '127.0.0.1', '0.0.0.0', '::ffff:127.0.0.1'];

    if (localIPs.includes(ip.toLowerCase())) {
      return 'localhost';
    }

    const ipv4Pattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;
    if (ipv4Pattern.test(ip)) {
      return ip;
    }

    const ipv4MappedIPv6Pattern = /^::ffff:(\d{1,3}\.){3}\d{1,3}$/;
    if (ipv4MappedIPv6Pattern.test(ip)) {
      return ip.replace(/^::ffff:/, '');
    }

    const ipv6Pattern = /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$/;
    if (ipv6Pattern.test(ip)) {
      return ip;
    }

    return null;
  }

  static isValidUUID(value: string, throwError: boolean = true) {
    if (!isUUID(value)) {
      if (throwError) {
        throw new BadRequestException('Invalid ID specified');
      } else {
        return false;
      }
    }

    return true;
  }

  static getDeviceInfo(req: Request) {
    const parser = new UAParser(req.headers['user-agent']).getResult();

    const os = parser.os.name;
    const device = parser.device.model;
    const cpu = parser.cpu.architecture;
    const browser = parser.browser.name;
    const deviceType = parser.device.type;

    return { os, device, browser, deviceType, cpu };
  }

  static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static extractDateTime(date: string | Date, time: boolean = true) {
    try {
      const dateTime = new Date(date);

      return dateTime
        .toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          ...(time && { hour: 'numeric', minute: 'numeric', hour12: true }),
        })
        .replace(',', ' at');
    } catch (err) {
      console.error(err);
      return '';
    }
  }

  static async hash(plain: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plain, salt);
  }

  static async compareHash(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
  }
}
