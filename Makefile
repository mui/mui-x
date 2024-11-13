PROJECT_NAME:="${PWD}"
#PROJECT_NAME:=$(shell dirname ${PWD})

NODE_VERSION:=22
NODE_IMAGE:=mynode:${NODE_VERSION}
WORKDIR:=/mnt/app
NODE_BIN:=${WORKDIR}/node_modules/.bin


image:
	docker build \
		-t mynode:${NODE_VERSION} \
		--build-arg NODE_VERSION=${NODE_VERSION} \
		--build-arg WORKDIR=${WORKDIR} \
		--build-arg PROJECT_NAME=${PROJECT_NAME} \
		-f Dockerfile.localdev \
		.

sh: image
	docker run -it --rm \
		-v "${PWD}":${WORKDIR} \
		-e PROJECT_NAME=${PROJECT_NAME} \
		--entrypoint bash \
		${NODE_IMAGE}

serve: image
	docker run -it --rm \
		-v "${PWD}":${WORKDIR} \
		-p 3001:3001 \
		${NODE_IMAGE} \
		pnpm docs:dev
