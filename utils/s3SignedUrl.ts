import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

type S3ObjectLocation = {
  bucket: string;
  key: string;
};

type VideoS3Config = {
  bucket: string;
  key: string;
  expiresInSeconds?: number;
};

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        sessionToken: process.env.AWS_SESSION_TOKEN,
      },
    });
  }

  return s3Client;
}

function hasAwsCredentials(): boolean {
  return Boolean(
    process.env.AWS_REGION &&
      process.env.AWS_ACCESS_KEY_ID &&
      process.env.AWS_SECRET_ACCESS_KEY
  );
}

export function parseS3LocationFromUrl(url: string): S3ObjectLocation | null {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const key = decodeURIComponent(parsed.pathname.replace(/^\/+/, ''));

    if (!key) {
      return null;
    }

    if (parsed.hostname.includes('.s3.')) {
      const bucket = parsed.hostname.split('.s3.')[0];
      return bucket ? { bucket, key } : null;
    }

    if (parsed.hostname === 's3.amazonaws.com') {
      const [bucket, ...rest] = key.split('/');
      const normalizedKey = rest.join('/');
      return bucket && normalizedKey ? { bucket, key: normalizedKey } : null;
    }

    return null;
  } catch {
    return null;
  }
}

export async function buildPresignedVideoUrl(
  currentUrl: string,
  expiresInSeconds = 3600
): Promise<string> {
  if (!currentUrl) {
    return '';
  }

  if (process.env.S3_PRESIGN_DISABLED === 'true') {
    return currentUrl;
  }

  const location = parseS3LocationFromUrl(currentUrl);

  if (!location) {
    return currentUrl;
  }

  if (!hasAwsCredentials()) {
    return currentUrl;
  }

  const command = new GetObjectCommand({
    Bucket: location.bucket,
    Key: location.key,
  });

  return getSignedUrl(getS3Client(), command, { expiresIn: expiresInSeconds });
}

export async function buildPresignedVideoUrlFromLocation(
  location: S3ObjectLocation,
  expiresInSeconds = 3600
): Promise<string> {
  if (!location?.bucket || !location?.key) {
    return '';
  }

  if (process.env.S3_PRESIGN_DISABLED === 'true') {
    return '';
  }

  if (!hasAwsCredentials()) {
    return '';
  }

  const command = new GetObjectCommand({
    Bucket: location.bucket,
    Key: location.key,
  });

  return getSignedUrl(getS3Client(), command, { expiresIn: expiresInSeconds });
}

export async function resolveOnboardingVideoUrl(input: {
  videoS3?: VideoS3Config;
  sourceVideoUrl?: string;
  fallbackUrl?: string;
  defaultExpiresInSeconds?: number;
}): Promise<string> {
  const {
    videoS3,
    sourceVideoUrl = '',
    fallbackUrl = '',
    defaultExpiresInSeconds = 3600,
  } = input;

  if (videoS3?.bucket && videoS3?.key) {
    const byLocation = await buildPresignedVideoUrlFromLocation(
      { bucket: videoS3.bucket, key: videoS3.key },
      videoS3.expiresInSeconds || defaultExpiresInSeconds
    );

    if (byLocation) {
      return byLocation;
    }
  }

  if (sourceVideoUrl) {
    return buildPresignedVideoUrl(sourceVideoUrl, defaultExpiresInSeconds);
  }

  return fallbackUrl;
}