drop database if exists stack_attack;

create database stack_attack;

\c journey_junction;

create table users (
    id serial primary key,
    email varchar(255) not null unique,
    password varchar(64) not null
);

create table containers (
    id serial primary key,
    name varchar(255) not null,
    parent_id integer,
    user_id integer not null,
    foreign key (parent_id) references containers(id) on delete cascade,
    foreign key (user_id) references users(id) on delete cascade
);

create table items (
    id serial primary key,
    name varchar(255) not null,
    description text,
    container_id integer not null,
    user_id integer null,
    foreign key (container_id) references containers(id) on delete cascade,
    foreign key (user_id) references users(id) on delete cascade
);