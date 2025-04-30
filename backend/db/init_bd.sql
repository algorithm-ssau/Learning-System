-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema learning_sys_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema learning_sys_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `learning_sys_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `learning_sys_db` ;

-- Table `learning_sys_db`.`game_field`
CREATE TABLE IF NOT EXISTS `learning_sys_db`.`game_field` (
  `id_game_field` INT NOT NULL AUTO_INCREMENT,
  `length` INT NOT NULL,
  `width` INT NOT NULL,
  `layout_array` VARCHAR(1000) NOT NULL,
  `energy` INT NOT NULL,
  PRIMARY KEY (`id_game_field`))
ENGINE = InnoDB;

-- Table `learning_sys_db`.`goal`
CREATE TABLE IF NOT EXISTS `learning_sys_db`.`goal` (
  `id_goal` INT NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_goal`))
ENGINE = InnoDB;

 -- Table `learning_sys_db`.`student`
 CREATE TABLE IF NOT EXISTS `learning_sys_db`.`student` (
   `name` VARCHAR(45) NULL,
   `surname` VARCHAR(45) NULL,
   `patronymic` VARCHAR(45) NULL,
   `login` VARCHAR(45) NOT NULL,
   `password` VARCHAR(45) NOT NULL,
   `class` VARCHAR(45) NOT NULL,
   PRIMARY KEY (`login`)
   )
 ENGINE = InnoDB;

-- Table `learning_sys_db`.`task`
CREATE TABLE IF NOT EXISTS `learning_sys_db`.`task` (
  `id_task` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `id_game_field` INT NOT NULL,
  `id_goal` INT NOT NULL,
  PRIMARY KEY (`id_task`),
  INDEX `fk_task_game_field_idx` (`id_game_field` ASC) VISIBLE,
  INDEX `fk_task_goal1_idx` (`id_goal` ASC) VISIBLE,
  CONSTRAINT `fk_task_game_field`
    FOREIGN KEY (`id_game_field`)
    REFERENCES `learning_sys_db`.`game_field` (`id_game_field`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_task_goal1`
    FOREIGN KEY (`id_goal`)
    REFERENCES `learning_sys_db`.`goal` (`id_goal`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- Table `learning_sys_db`.`journal`
CREATE TABLE IF NOT EXISTS `learning_sys_db`.`journal` (
  `mark` INT NULL,
  `id_journal` INT NOT NULL AUTO_INCREMENT,
  `student_login` VARCHAR(45) NOT NULL,
  `id_task` INT NOT NULL,
  PRIMARY KEY (`id_journal`),
  INDEX `fk_journal_student1_idx` (`student_login` ASC) VISIBLE,
  INDEX `fk_journal_task1_idx` (`id_task` ASC) VISIBLE,
  CONSTRAINT `fk_journal_student1`
    FOREIGN KEY (`student_login`)
    REFERENCES `learning_sys_db`.`student` (`login`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_journal_task1`
    FOREIGN KEY (`id_task`)
    REFERENCES `learning_sys_db`.`task` (`id_task`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- Table `learning_sys_db`.`solution`
CREATE TABLE IF NOT EXISTS `learning_sys_db`.`solution` (
  `algorithm` VARCHAR(1000) NULL,
  `student_login` VARCHAR(45) NOT NULL,
  `id_task` INT NOT NULL,
  `id_solution` VARCHAR(45) NOT NULL, -- Этот столбец не нуждается в автоинкременте
  PRIMARY KEY (`id_solution`),
  INDEX `fk_solution_student1_idx` (`student_login` ASC) VISIBLE,
  INDEX `fk_solution_task1_idx` (`id_task` ASC) VISIBLE,
  CONSTRAINT `fk_solution_student1`
    FOREIGN KEY (`student_login`)
    REFERENCES `learning_sys_db`.`student` (`login`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_solution_task1`
    FOREIGN KEY (`id_task`)
    REFERENCES `learning_sys_db`.`task` (`id_task`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
ENGINE = InnoDB;