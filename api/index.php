<?php


$ROOT = "../root";
$ROOT = realpath($ROOT);

$USERS = [
    ['user' => 'dev', 'password' => 'dev'],
    ['user' => 'nelly', 'password' => 'plop'],
    ['user' => 'johndoe', 'password' => 'wqszdeaztRedfdc'],
];

class FM
{
    public string $realRoot;

    public string $path = '/';
    public string $command;
    public array $params;
    public array $ls;
    public string $message = '';
    public bool $isLogged = false;
    public string $error = '';
    public string $realPath;

    function __construct()
    {
        global $ROOT;
        $root = $ROOT;
        //  if (isset($_POST['submit'])) {
        //$vars = json_decode(file_get_contents('php://input'), true);

        $c = $_POST['cmd'] ?? 'ls';

        $this->params = $_POST['params'] ?? [];
        if (!$this->_checkIsLogged()) {

            $this->_response();
            exit();
        }


        $this->realRoot  = realpath($root);
        $this->realPath  = $this->realRoot;

        if (!$this->_changePath($_POST['path'] ?? '/')) {
            $this->error = 'No valid Path';
            $this->path = '/';
            $this->_response();
        }

        if (is_callable(array($this, $c)) && strpos($c, '_') !== 0) {
            $this->{$c}();
        }

        $this->_response();
    }

    function _checkIsLogged()
    {
        global $USERS;
        session_start();
        $this->isLogged = false;
        if (isset($_SESSION['isLogged'])) {
            return $this->isLogged = true;
        }
        if ($_POST['cmd'] !== 'login') {
            return false;
        }

        $login = $this->params[0] ?? false;
        $password = $this->params[1] ?? false;
        if (!$login || !$password) {
            $this->message = 'No valid User';
            return false;
        }
        for ($i = 0; $i < count($USERS); $i++) {
            if ($USERS[$i]['user'] === $login && $USERS[$i]['password'] === $password)
                return $_SESSION['isLogged'] = $this->isLogged = true;
        }

        $this->message = 'No valid User';
        return false;
    }

    function logout()
    {
        session_destroy();
        $this->path = '/';
        $this->isLogged = false;
    }
    function upload()
    {
        // Count total files
        $countfiles = count($_FILES['file']['name']);

        // Looping all files
        for ($i = 0; $i < $countfiles; $i++) {
            $filename = $_FILES['file']['name'][$i];

            // Upload file
            move_uploaded_file($_FILES['file']['tmp_name'][$i], $this->realPath . '/' . $filename);
            $this->message = 'FILES UPLOADED';
        }
    }
    function _changePath($path)
    {
        if (strpos($path, "/") === 0)
            $realPath = realpath($this->realRoot . '/' . $path); //absolute
        else
            $realPath = realpath($this->realPath . '/' . $path);  //relative

        if ($realPath === false) return false;
        if (strpos($realPath, $this->realRoot) !== 0) return false;

        $path = substr($realPath, strlen($this->realRoot));
        $path = str_replace('\\', '/', $path);
        if ($path === '') $path = '/';
        $this->realPath = $realPath;
        $this->path = $path;
        return true;
    }

    function _ls()
    {

        $folders = [];
        $files = [];
        foreach (glob("$this->realPath/*") as $filename) {
            $pathinfo = pathinfo($filename);

            $info = [];
            $info['name'] = $pathinfo['basename'];
            $info['date'] = date("Y-m-d H:i:s", filectime($filename));
            //$info['url'] = $filename;
            if ($info['isDir'] = is_dir($filename)) {

                $folders[] = $info;
            } else {
                $filesize = ceil(filesize($filename) / 1024) . ' Kb';
                $info['filesize'] = $filesize;
                $info['url'] = substr($filename, strlen($_SERVER['DOCUMENT_ROOT']));
                $imgInfo = getimagesize($filename);
                if ($imgInfo !== false) {
                    list($width, $height, $type, $attr) = $imgInfo;
                    $imageTypeArray = array(
                        0 => 'UNKNOWN',
                        1 => 'GIF',
                        2 => 'JPEG',
                        3 => 'PNG',
                        4 => 'SWF',
                        5 => 'PSD',
                        6 => 'BMP',
                        7 => 'TIFF_II',
                        8 => 'TIFF_MM',
                        9 => 'JPC',
                        10 => 'JP2',
                        11 => 'JPX',
                        12 => 'JB2',
                        13 => 'SWC',
                        14 => 'IFF',
                        15 => 'WBMP',
                        16 => 'XBM',
                        17 => 'ICO',
                        18 => 'COUNT'
                    );

                    $type = $imageTypeArray[$type];
                    $info['imagesize'] = "$width x $height - $filesize - $type";
                }
                $files[] = $info;
            }
        }

        return $this->ls = ["folders" => $folders, "files" => $files];
        // $this->_response();
    }
    function cd()
    {

        $dir =  $this->params[0] ?? '/';
        if (!$this->_changePath($dir)) {
            $this->error = 'No valid Path ' . $dir;
        }
    }

    function mkdir()
    {
        $folder = $this->params[0];
        if (!$this->_isValidFileName($folder)) {
            $this->error = 'No valid folder name';
            return;
        }
        $realFolder = $this->realPath . '/' . $folder;

        if (file_exists($realFolder)) {
            $this->error = $folder . ' already exist';
            return;
        }

        $this->message = mkdir($realFolder) ?
            "$folder was created"
            : "$folder could not be created";
    }
    function mv()
    {
        $oldName = $this->params[0];
        $newName = $this->params[1];

        if (!$this->_isValidFileName($oldName)) {
            $this->error = 'No valid name';
            return;
        }
        if (!$this->_isValidFileName($newName)) {
            $this->error = 'No valid name';
            return;
        }
        $realName = $this->realPath . '/' . $oldName;

        if (!file_exists($realName)) {
            $this->error = $oldName . ' does not exist';
            return;
        }

        if (rename($realName, $this->realPath . '/' . $newName))
            $this->message = "$oldName was renamed";
        else
            $this->error = "$oldName could not be renamed";
    }
    function rm()
    {
        $success = 0;
        $failed = 0;
        for ($i = 0; $i < count($this->params); $i++) {
            $name = $this->params[$i];
            if (!$this->_isValidFileName($name)) {
                $this->error = 'No valid name';
                return;
            }
            $realName = $this->realPath . '/' . $name;

            if (!file_exists($realName)) {
                $this->error = $name . ' does not exist';
                return;
            }
            if (
                !is_dir($realName) && unlink($realName)
                || is_dir($realName) && $this->_rm($realName)
            )
                $success++;
            else
                $failed++;
        }

        $this->message =  "$success file(s) deleted" . ($failed) ? " $failed failed." : "";
        $this->error = ($failed) ? " $failed failed." : "";
    }

    function _rm($src)
    {
        if (!$src) return false;
        if (file_exists($src)) {
            $dir = opendir($src);
            while (false !== ($file = readdir($dir))) {
                if (($file != '.') && ($file != '..')) {
                    $full = $src . '/' . $file;
                    if (is_dir($full)) {
                        $this->_rm($full);
                    } else {
                        unlink($full);
                    }
                }
            }
            closedir($dir);
            return rmdir($src);
        }
    }


    function _isValidFileName($filename)
    {
        return $filename !== '.'
            && $filename !== '..'
            && preg_match('/^[a-z0-9A-Z.-_]+$/', $filename) !== false;
    }
    private function _response()
    {

        $response = [];
        $response['path'] = $this->path;
        $response['isLogged'] = $this->isLogged;
        if ($this->isLogged) $response['ls'] = $this->_ls();

        if ($this->error) $response['error'] = $this->error;
        if ($this->message) $response['message'] = $this->message;
        exit(json_encode($response, JSON_PRETTY_PRINT));
    }
}


$fm = new FM();
