const os = require('os');
const path = require('path');
const fs = require('fs');

const config = require('config');
const express = require('express');
const fsExtra = require('fs-extra');
const SimpleGit = require('simple-git');
const showdown = require('showdown');

const { filterEmptyString, splitMetaItem } = require('../libs/helper');

const converter = new showdown.Converter();
const simpleGit = SimpleGit(config.targetDir);
const router = express.Router();
const blogDataDir = path.join(config.targetDir, config.repositoryName);

function pullRepository() {
  const tempDir = path.join(os.tmpdir(), 'githubhook_temp_' + config.repositoryName + Date.now());
  logger.info('pullRepository start', { tempDir });

  return new Promise((resolve, reject) => {
    simpleGit.clone(
      `https://www.github.com/polunzh/${config.repositoryName}`,
      `${path.join(tempDir)}`,
      {
        bare: true,
      },
      err => {
        if (err) {
          return reject(err);
        }

        logger.info('pullRepository cloned');
        fsExtra.move(
          tempDir,
          blogDataDir,
          {
            overwrite: true,
          },
          err => {
            if (err) return reject(err);

            fsExtra.removeSync(tempDir);
            logger.info('pullRepository done');
            resolve();
          }
        );
      }
    );
  });
}

const parsePostMeta = metaStr => {
  const metaArray = filterEmptyString(metaStr.split('\n'));
  let isHandleSubAttribute = false;
  let tmpTags = [];
  const meta = {};

  // console.log(metaArray);
  metaArray.forEach(metaItem => {
    if (isHandleSubAttribute) {
      const isSubAttribute = metaItem[0] === '-';
      if (isSubAttribute) {
        tmpTags.push(metaItem.substring(1).trim());
      } else {
        meta.tags = tmpTags;
        isHandleSubAttribute = false;

        const [key, value] = filterEmptyString(splitMetaItem(metaItem));
        meta[key] = value;
      }
    } else {
      const [key, value] = filterEmptyString(splitMetaItem(metaItem));
      if (key === 'tags') {
        if (value !== undefined) {
          meta.tags = filterEmptyString(splitMetaItem(metaItem));
        } else {
          isHandleSubAttribute = true;
          tmpTags = [];
        }
      } else {
        meta[key] = value;
      }
    }
  });

  if (tmpTags.length !== 0) {
    meta.tags = tmpTags;
  }

  return meta;
};

const parsePostContent = content => converter.makeHtml(content);

const parseData = async () => {
  const postDir = path.join(blogDataDir, 'source', '_posts');
  const postFiles = fs.readdirSync(postDir);

  const posts = {};
  for (const fileName of postFiles) {
    const data = fs
      .readFileSync(path.join(postDir, fileName))
      .toString()
      .replace('\r\n', '\n');

    const [metaStr, content] = data.split('---');

    const post = {
      meta: parsePostMeta(metaStr),
      content: parsePostContent(content),
    };

    posts[fileName] = post;
  }

  global.posts = posts;
};

const initData = async () => {
  try {
    // fsExtra.emptyDirSync(config.targetDir);
    // await pullRepository();
    parseData();
  } catch (error) {
    logger.info('initData error', { error: error.toString() });
  }
};

const pingMiddleWare = (req, res, next) => {
  if (!req.get('X-GitHub-Event')) {
    return res.status(400).send('Invalid request');
  }

  if (req.get('X-GitHub-Event') === 'ping') {
    logger.info('github.ping');

    return res.status(204).send();
  }

  next();
};

router.post(`/github/${config.repositoryName}`, pingMiddleWare, async (req, res, next) => {
  if (req.get('X-GitHub-Event') !== 'push') {
    logger.warn(`Invalid event type: ${req.get('X-GitHub-Event')}`);
    return res.status(400).send('Invalid event type');
  }

  try {
    await pullRepository();
    logger.info('update blog data done!');

    return res.status(204).send();
  } catch (error) {
    logger.error('update repository failed', { error: error.toString() });

    return res.status(500).send();
  }
});

module.exports = { router, initData };
